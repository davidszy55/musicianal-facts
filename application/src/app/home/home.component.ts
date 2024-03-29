import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import { ProxyService } from "../proxy.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private proxyService: ProxyService,
    private router: Router
  ) {
    this.dataService.musicServiceSelectionChange.subscribe((): void => {
      this.appleIsSelected = false;
      this.lastfmIsSelected = false;
      this.spotifyIsSelected = false;
    });
  };

  ngOnInit() {
    let currentURL: string = this.router.url;
    this.ready = false;
    this.username = "";

    if (!currentURL.includes("?")) {
      this.appleIsSelected = false;
      this.lastfmIsSelected = false;
      this.spotifyIsSelected = false;
    } else {
      let query: {[key: string]: string} = {};
      let queryArray: any = currentURL.substring(currentURL.indexOf("?") + 1).split("&");

      queryArray.forEach((item: string): void => {
        query[item.split("=")[0]] = item.split("=")[1];
      });

      if ("code" in query && "state" in query) {
        this.spotifyIsSelected = true;
        this.proxyService.spotifyLoginCallback(query["code"]).then((res: any): void => {
          console.log(res);
        });
      }
    }
  };

  days: Array<string> = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  months: Array<string> = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  monthsAlt: { [key: string]: number } = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
  };

  today: Date = new Date();
  month: string = this.months[this.today.getMonth()];
  year: number = this.today.getFullYear();
  day: string = this.days[this.today.getDay()];
  date: string = String(this.today.getDate());
  suffix: string = this.getSuffix(this.date.charAt(this.date.length - 1));
  dateString: string = `${this.day}, ${this.month} ${this.date}${this.suffix}, ${this.year}`;
  dateStringAlt: string = `${this.monthsAlt[this.month]}.${this.date}.${this.year}`;

  appleIsSelected: boolean = false;
  lastfmIsSelected: boolean = false;
  spotifyIsSelected: boolean = false;

  selectedType: string = "tracks";
  selectedTimeRange: string = "short_term";
  selectedQuantity: string = "10";

  response: any = [];
  ready: boolean = false;
  username: string = "";

  appleButtonPress(): void {
    this.appleIsSelected = true;
    this.response = [];
  };

  lastfmButtonPress(): void {
    this.lastfmIsSelected = true;
    this.response = [];
  };

  spotifyButtonPress(): void {
    this.spotifyIsSelected = true;
    this.response = [];
    //this.proxyService.spotifyLogin();
  };

  convertDuration(milli: number): string {
    let seconds = Math.floor((milli / 1000) % 60);
    let minutes = Math.floor((milli / (60 * 1000)) % 60);
    let res = minutes + ":" + seconds;

    return (res.length == 3) ? res + "0" : res;
  }

  getSuffix(num: string): string {
    const _: string[] = ["1", "2", "3"]
    const suffix: {[key: string]: string} = {
      "1": "st",
      "2": "nd",
      "3": "rd"
    };
    return (num in _) ? suffix[num as string] : "th";
  };

  sendSpotifyRequest(): void {
    if (this.selectedType == "genres" || this.selectedType == "albums") this.selectedQuantity = "";
    this.proxyService.sendSpotifyRequest(this.selectedType, this.selectedTimeRange, this.selectedQuantity).then((res: any): void => {
      let tmp: any[] = [];
      tmp.push(Object.keys(res).length.toString());
      tmp.push(res.username);
      console.log(res);

      if (this.selectedType == "tracks") {
        tmp.push("songs");
      } else tmp.push(this.selectedType);

      if (this.selectedTimeRange == "short_term") {
        tmp.push("Month");
      } else if (this.selectedTimeRange == "medium_term") {
        tmp.push("6 Months");
      } else if (this.selectedTimeRange == "long_term") {
        tmp.push("All Time");
      }

      this.response.push(tmp);

      for (const key in res) {
        tmp = [];

        if (key == "username") continue;

        for (const key2 in res[key.toString()]) {
          tmp.push(res[key.toString()][key2.toString()]);
        }
        this.response.push(tmp);
      }

      // let i: number = 0;
      // for (let row of this.response.slice(1)) {
      //   console.log("###########################");
      //   console.log(i);
      //   console.log(row);
      //   console.log(row[3]);
      //   console.log(Object.keys(row[3]));
      //   // @ts-ignore
      //   console.log(Object.keys(row[3])[0]); // artists
      //   // @ts-ignore
      //   console.log(row[3][Object.keys(row[3])[0]]);
      //   // @ts-ignore
      //   console.log((row[3][Object.keys(row[3])[0]]).name);
      //   i++;
      // }


      this.ready = true;
      console.log("Response: ");
      console.log(this.response);
    });
  };

  setTimeRange(timeRange: string): void {
    this.selectedTimeRange = timeRange;
  };

  setQuantity(quantity: string): void {
    this.selectedQuantity = quantity;
  };

  setType(type: string): void {
    this.selectedType = type;
  };

  protected readonly Object = Object;
}
