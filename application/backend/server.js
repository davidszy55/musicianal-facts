const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const onFinished = require("on-finished");
const { request } = require("request");
const { stringify } = require("querystring");

const distDir =  __dirname + "/../dist/application/";
const REDIRECT_URI = 'http://localhost:4200';
const SPOTIFY_AUTH_STATE_KEY = "spotify_auth_state";

const app = express();
app.use(bodyParser.json())
  .use(cors())
  .use(cookieParser());

const server = app.listen(process.env.PORT || 8080, function() {
  console.log("Node.js back-end server is now running on localhost:" + server.address()["port"]);
})

// FUNCTIONS
let generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// SPOTIFY
const clientID = "5fa6e9839828408c8227c729454e8172";
const clientSecret = "1e93748a24554f9586060bbe603b4915";

// Request authorization from user
app.get("/spotify/login", (req, res, next) => {
  let state = generateRandomString(16);
  let scope = "user-read-private user-read-email user-top-read";
  res.cookie(SPOTIFY_AUTH_STATE_KEY, state);
  console.log("Inside /spotify/login");
  console.log("State: ");
  console.log(state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    stringify({
      response_type: 'code',
      client_id: clientID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
    })
  );
});

// After the application requests Spotify authorization from the user, this function is called
// The callback route is set in the REDIRECT_URI variable and in the Spotify Web API dashboard
app.get("/callback", (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let authState = req.cookies ? req.cookies[SPOTIFY_AUTH_STATE_KEY] : null;
  console.log("Now calling next() instructions");

  if (!state || state !== authState) {
    res.redirect("/#" + stringify({error: "state_mismatch"}));
  } else {
    res.clearCookie(SPOTIFY_AUTH_STATE_KEY);
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization: "Basic " + new Buffer(`${clientID}:${clientSecret}`).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        let accessToken = body["accessToken"];
        let refreshToken = body["refreshToken"];

        res.redirect("/#" + stringify({
          client: "spotify",
          access_token: accessToken,
          refresh_token: refreshToken,
        }));
      } else {
        res.send("There was an error during authentication.");
      }
    });
  }
})
