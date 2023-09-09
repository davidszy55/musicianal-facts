import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {
    this.musicServiceSelectionChange.subscribe((value: boolean): void => {
      this.isMusicServiceSelected = value;
    });
  }

  isMusicServiceSelected: boolean = false;
  musicServiceSelectionChange: Subject<boolean> = new Subject<boolean>();

  resetSelection(): void {
    this.musicServiceSelectionChange.next(false);
  };
}
