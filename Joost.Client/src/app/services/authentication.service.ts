import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { BaseApiService } from "./base-api.service";
import { HttpParams } from "@angular/common/http";

@Injectable()
export class AuthenticationService extends BaseApiService {
  private token: string;
  private isError:boolean;

  constructor(http: HttpClient) {
    super(http);
    this.parUrl = "account";
    this.token = localStorage.getItem('joostUserToken'); 
  }

  getToken(): string {
    return this.token;
  }

  isUserLogined():boolean {
    return this.token != null && this.token != '';
  }

  login(email: string, password: string) {
    let obj = this.loginObservable(email, password);
    obj.subscribe(
      data=>{
        console.log(data.accessToken);
        this.token = data.accessToken;
        localStorage.setItem('joostUserToken', data.accessToken);
      },
      err=> this.isError = true
    );
    return obj;
  }

  private loginObservable(email: string, password: string) {
     return this.http.post<Token>(this.generateUrl() + "/auth", {"Email": email, "Password" : password});
  }

  logout() {
    this.token = null;
    localStorage.removeItem('joostUserToken');
  }

  getUserId() {
    return this.http
    .get<number>(this.generateUrl());
  }
}
interface Token{
  accessToken:string,
  refreshToken:string
}
