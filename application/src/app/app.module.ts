import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRippleModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule } from "@angular/router";

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SpotifyComponent } from './spotify/spotify.component';

import { DataService } from "./data.service";
import { ProxyService } from "./proxy.service";

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AboutComponent,
    PrivacyComponent,
    ContactComponent,
    HomeComponent,
    SpotifyComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRippleModule,
    MatButtonToggleModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  providers: [
    DataService,
    ProxyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
