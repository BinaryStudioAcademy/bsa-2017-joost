import { Injectable } from '@angular/core';
//import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpService } from '../services/http.service';

import { BaseApiService } from "./base-api.service";

import { UserDetail, Login } from "../models/user-detail";
import { UserSearch } from "../models/user-search";

@Injectable()
export class LoginService extends BaseApiService {

    constructor(http: HttpService) {
        super(http);
        this.parUrl = "users";
    }

   
    addUser(user: Login) {
        let req = new HttpRequest("POST", this.generateUrl(), { "Email": user.Email, "Password": user.Password });
        return this.http.sendRequest(req);
        //return this.http
        //    .post(this.generateUrl(),
        //    { "Email": user.Email, "Password": user.Password });
    }
}

