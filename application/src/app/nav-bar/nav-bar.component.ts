import { Component } from '@angular/core';
import { DataService } from "../data.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  isLinkActive(link: any): boolean {
    const url = this.router.url;
    return link === url;
  };

  onClickHome(): void {
    this.dataService.resetSelection();
  };
}
