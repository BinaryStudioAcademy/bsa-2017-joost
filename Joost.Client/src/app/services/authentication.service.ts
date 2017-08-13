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
    this.parUrl = "account/auth";
    this.token = localStorage.getItem('joostUserToken'); 
  }

  getToken(): string {
    return this.token;
  }

  isUserLogined():boolean {
    return this.token != null && this.token != '';
  }

  login(email: string, password: string) {
    return this.http.post<Token>(this.generateUrl(),
    {"Email": email, "Password" : password})
    .subscribe(
      data=>{
        this.token = data.token;
        localStorage.setItem('joostUserToken',data.token)
      },
      err=> this.isError = true
    );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('joostUserToken');
  }

  getUserId() {
    console.log(this.token);
    return this.http
    .get<number>(this.generateUrl(),{
    params: new HttpParams().set('token', this.token)
    });
  }
}
interface Token{
  token:string,
}
