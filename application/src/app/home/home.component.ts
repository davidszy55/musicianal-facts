import { Component, OnInit } from '@angular/core';
import { ProxyService } from "../proxy.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private proxyService: ProxyService,
    private router: Router
  ) {};

  ngOnInit() {
    let currentURL = this.router.url;
    currentURL.includes("?") && this.proxyService.spotifyLoginCallback();
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

  ready: boolean = false;
  isLoading: boolean = false;

  today: Date = new Date();
  month: string = this.months[this.today.getMonth()];
  year: number = this.today.getFullYear();
  day: string = this.days[this.today.getDay()];
  date: string = String(this.today.getDate());
  suffix: string = this.getSuffix(this.date.charAt(this.date.length - 1));
  dateString: string = `${this.day}, ${this.month} ${this.date}${this.suffix}, ${this.year}`;

  lastfmSelected: string = "month";
  spotifySelected: string = "medium";

  appleButtonPress(): void {
    this.isLoading = true;
  };

  lastfmButtonPress(): void {
    this.isLoading = true;
  };

  spotifyButtonPress(): void {
    console.log("Inside spotifyButtonPress()");
    this.isLoading = true;
    // this.proxyService.spotifyAuthRequest()
      // .then((res: any) => {
      //   console.log("SPOTIFY RESULT: ");
      //   console.log(res);
      // });
  };

  getSuffix(num: string): string {
    const _ = ["1", "2", "3"]
    const suffix: {[key: string]: string} = {
      "1": "st",
      "2": "nd",
      "3": "rd"
    };

    return (num in _) ? suffix[num as string] : "th";
  };
}
