import { Injectable, EventEmitter } from '@angular/core';
//import { HttpClient } from "@angular/common/http";
import { HttpRequest, HttpResponse,HttpErrorResponse } from "@angular/common/http";
import { HttpService } from '../services/http.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { BaseApiService } from "./base-api.service";
import { HttpParams } from "@angular/common/http";
import { Tokens } from '../models/tokens';

@Injectable()
export class AuthenticationService extends BaseApiService {
  private token: string;
  public errorEvent: EventEmitter<HttpErrorResponse> = new EventEmitter<HttpErrorResponse>();
  constructor(http: HttpService) {
    super(http);
    this.parUrl = "account";
    this.token = localStorage.getItem('joostUserAccessToken'); 
  }

  getToken(): string {
    return this.token;
  }

  isUserLogined():boolean {
    return this.token != null && this.token != '';
  }

  login(email: string, password: string) {
    let obj = this.loginObservable(email, password);
    return obj.subscribe(
      data => {
        console.log(data);
        this.token = data.accessToken;
        localStorage.setItem('joostUserAccessToken', data.accessToken);
        localStorage.setItem('joostUserRefreshToken', data.refreshToken);        
        console.log('token saved');
      },
      err=> {
        this.errorEvent.emit(err);      }
    );
  }

  private loginObservable(email: string, password: string) {
    console.log("0) " + localStorage.getItem("joostUserAccessToken"));        
    let req = new HttpRequest("POST", this.generateUrl() + "/auth", {"Email": email, "Password" : password});
    return this.http.sendRequest<Tokens>(req);
    //return this.http.post<Tokens>(this.generateUrl() + "/auth", {"Email": email, "Password" : password});
  }

  logout() {
    this.token = null;
    localStorage.removeItem('joostUserAccessToken');
    localStorage.removeItem('joostUserRefreshToken');
  }
}
