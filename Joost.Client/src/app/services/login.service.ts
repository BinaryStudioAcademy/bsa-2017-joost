import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BaseApiService } from "./base-api.service";

import { UserDetail, Login } from "../models/user-detail";
import { UserSearch } from "../models/user-search";

@Injectable()
export class LoginService extends BaseApiService {

    constructor(http: HttpClient) {
        super(http);
        this.parUrl = "users";
    }

    confirmRegistration(key: string) {
        return this.http.get(this.generateUrl() + '/confirmregistration/' + key).subscribe(ok=>console.log(ok),error=>console.log(error));
    }

    addUser(user: Login) {
        return this.http
            .post(this.generateUrl(),
            { "Email": user.Email, "Password": user.Password });
    }
}

