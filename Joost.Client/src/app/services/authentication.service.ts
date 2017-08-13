import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { BaseApiService } from "./base-api.service";

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

}
interface Token{
  token:string,
}
