import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProxyService {

  constructor(private http: HttpClient) { }

  sendSpotifyRequest(type: string, timeRange: string, quantity: string): Promise<any> {
    console.log("Inside sendSpotifyRequest()");
    let endpoint: string = "http://localhost:8080/spotify/top/";
    endpoint += `${type}/${timeRange}`;
    if (quantity) endpoint += `/${quantity}`;

    return new Promise((resolve): void => {
      console.log(`Sending request to endpoint: ${endpoint}`);
      this.http.get(endpoint)
          .subscribe((res: any): void => {
            resolve(res);
          })
    })
  };

  spotifyLoginCallback(code: string): Promise<any> {
    console.log("Inside spotifyLoginCallback() with code: " + code);
    let endpoint: string = "http://localhost:8080/callback/" + code;

    return new Promise((resolve): void => {
      console.log("Sending request to endpoint: " + endpoint);
      this.http.get(endpoint)
          .subscribe((res: any): void => {
            resolve(res);
          })
    })
  };
}
