import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
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

  constructor() { }

  ready: boolean = false;
  isLoading: boolean = true;

  today: Date = new Date();
  month: string = this.months[this.today.getMonth()];
  year: number = this.today.getFullYear();
  day: string = this.days[this.today.getDay()];
  date: string = String(this.today.getDate());
  suffix: string = this.getSuffix(this.date.charAt(this.date.length - 1));
  dateString: string = `${this.day}, ${this.month} ${this.date}${this.suffix}, ${this.year}`;

  lastfmSelected: string = "month";
  spotifySelected: string = "medium";

  appleButtonPress() {};

  lastfmButtonPress() {};

  spotifyButtonPress() {};

  getSuffix(num: string) {
    const _ = ["1", "2", "3"]
    const suffix: {[key: string]: string} = {
      "1": "st",
      "2": "nd",
      "3": "rd"
    };

    return (num in _) ? suffix[num as string] : "th";
  };

}
