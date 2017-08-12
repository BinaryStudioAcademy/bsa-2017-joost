import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

import { BaseApiService } from "./base-api.service";

@Injectable()
export class AuthenticationService extends BaseApiService {
  private token: string;

  constructor(http: HttpClient) {
    super(http);
    this.parUrl = "account/auth";
    this.token = JSON.parse(localStorage.getItem('joostUserToken')); 
  }

  getToken(): string {
    return this.token;
  }

  isUserLogined():boolean {
    return this.token != null && this.token != '';
  }

  login(email: string, password: string) {
    return this.http.post(this.generateUrl(),
    JSON.stringify({Email: email, Password : password}))
    .map((response: Response) => {
      // let token = response.body;
      // if(token) {
      //   this.token = token;
      //   return true;
      // }
      // else {
      //   return false;
      // }
      return true;
    })
  }

  logout() {
    this.token = null;
    localStorage.removeItem('joostUserToken');
  }

}
