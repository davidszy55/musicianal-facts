import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProxyService {

  constructor(
    private http: HttpClient,
    @Inject('baseURL') @Optional() private baseURL?: string
  ) {
    this.baseURL = "http://localhost:8080/";
  }

  sendSpotifyRequest(type: string, timeRange: string, quantity: string): Promise<any> {
    console.log("Inside sendSpotifyRequest()");
    let endpoint: string = `${this.baseURL}spotify/top/${type}/${timeRange}`;
    if (quantity) endpoint += `/${quantity}`;

    return new Promise((resolve): void => {
      console.log(`Sending request to endpoint: ${endpoint}`);
      this.http.get(endpoint)
        .subscribe((res: any): void => {
          resolve(res);
        })
    })
  };

  spotifyLogin(): Promise<any> {
    console.log("Inside spotifyLogin()");
    let endpoint: string = `${this.baseURL}spotify/login`;

    return new Promise((resolve): void => {
      console.log(`Sending request to endpoint: ${endpoint}`);
      this.http.get(endpoint)
        .subscribe((res: any): void => {
          resolve(res);
        })
    })
  }

  spotifyLoginCallback(code: string): Promise<any> {
    console.log("Inside spotifyLoginCallback() with code: " + code);
    let endpoint: string = `${this.baseURL}callback/${code}`;

    return new Promise((resolve): void => {
      console.log("Sending request to endpoint: " + endpoint);
      this.http.get(endpoint)
          .subscribe((res: any): void => {
            resolve(res);
          })
    })
  };
}
