const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
let SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(bodyParser.json())
  .use(cors())
  .use(cookieParser());

const server = app.listen(process.env["PORT"] || 8080, function() {
  console.log("Node.js back-end server is now running on localhost:" + server.address()["port"]);
})

// FUNCTIONS
let generateRandomString = function (length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// ############################################################
// ######                   SPOTIFY                      ######
// ############################################################

const clientId = "5fa6e9839828408c8227c729454e8172";
const clientSecret = "1e93748a24554f9586060bbe603b4915";
const REDIRECT_URI = 'http://localhost:4200';
const SCOPES = ["user-read-private", "user-read-email", "user-top-read"];
let state = generateRandomString(16);
let spotifyApi;
spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: REDIRECT_URI
});
let authorizeURL = spotifyApi.createAuthorizeURL(
    SCOPES,
    state,
    false,
    "code"
);

// Request authorization from user
app.get("/spotify/login", (_, res) => {
  console.log("Inside Spotify Login");
  console.log(`Authorize URL: ${authorizeURL}`);
  res.redirect(authorizeURL);
});

app.get("/spotify/top/:type/:timeRange/:quantity?", async (req, res) => {
  let type = req.params.type;
  let timeRange = req.params["timeRange"];
  let quantity = (req.params["quantity"]) ? req.params["quantity"] : null;

  if (type === "tracks") {
    let [topTracks, username] = await Promise.all([spotifyGetTopTracks(timeRange, quantity), spotifyGetUsername()]);
    topTracks.username = username["body"]["display_name"];
    res.send(topTracks);
  }
  if (type === "artists") {
      let [topArtists, username] = await Promise.all([spotifyGetTopArtists(timeRange, quantity), spotifyGetUsername()]);
      topArtists["username"] = username["body"]["display_name"];
      res.send(topArtists);
  }
  if (type === "genres") {
      spotifyGetTopTracks(timeRange, 10, true);
  }
  if (type === "albums") {
      spotifyGetTopTracks(timeRange, 10, false, true)
  }
});

// After the application requests Spotify authorization from the user, this function is called
// to retrieve the access and refresh tokens
app.get("/callback/:code", (req) => {
    let code = req.params.code;
  spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
      console.log("Token received");
      console.log("The token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);
      console.log("The refresh token is " + data.body["refresh_token"]);

      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
      setInterval(refreshSpotifyToken, 1000 * 59 * 59);
    },
      function(err) {
        console.log("An error occurred in the callback.", err);
      }
  );
})

function refreshSpotifyToken() {
    spotifyApi.refreshAccessToken().then(
        function(data) {
            console.log("Access token has been refreshed.");
            spotifyApi.setAccessToken(data.body["access_token"]);
        },
        function(err) {
            console.log("Could not refresh access token.", err);
        }
    );
}

function spotifyGetTopArtists(timeRange, quantity) {
    let topArtists;
    let results = {};
    let options = {
        time_range: timeRange,
        limit: quantity,
        offset: 0
    };

  return new Promise((resolve) => {
    spotifyApi.getMyTopArtists(options)
      .then(function (data) {
        topArtists = data.body.items;
        topArtists.forEach((artist) => {
          results[artist.name] = {
            name: artist.name,
            popularity: artist.popularity,
            genres: artist.genres,
            uri: artist.uri,
            id: artist.id,
            url: artist["external_urls"].spotify
          };
        });
        resolve(results);
        }, function(err) {
            console.log("An error occurred in spotifyGetTopArtists.", err);
        });
    });
}

function spotifyGetTopTracks(timeRange, quantity, isGenre = false, isAlbums = false) {
  let topTracks;
  let results = {};
  let options = {
    time_range: timeRange,
    limit: quantity
  };

  return new Promise((resolve) => {
    spotifyApi.getMyTopTracks(options)
      .then(function (data) {
        topTracks = data.body.items;
        topTracks.forEach((track) => {
          let tmp = {};
          track["artists"].forEach((artist) => {
              tmp[artist.name] = {
              name: artist.name,
              uri: artist.uri,
              id: artist.id,
              href: artist.href,
              spotify_url: artist["external_urls"].spotify,
            };
          });
          results[track.name] = {
            name: track.name,
            popularity: track.popularity,
            uri: track.uri,
            artist: tmp,
            duration: track.duration_ms,
            url: track["external_urls"].spotify,
            href: track.href,
            id: track.id,
            preview: track["preview_url"]
          };
        });
        resolve(results);
      }, function (err) {
        console.log("An error occurred in spotifyGetTopTracks.", err);
      });
  });
}

function spotifyGetUsername() {
  return new Promise((resolve) => {
    spotifyApi.getMe()
      .then(function(data) {
        resolve(data);
      }, function(err) {
        console.log("An error occurred getting the authorized user's profile.", err);
        }
      );
  });
}
