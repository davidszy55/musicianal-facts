import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProxyService {

  constructor(private http: HttpClient) { }

  spotifyLoginCallback() {
    console.log("Inside spotifyLoginCallback():");
    let endpoint = "http://localhost:8080/callback";
    this.http.get<any>(endpoint);
  };
}
