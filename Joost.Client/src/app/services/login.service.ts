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

    /*searchResult(name: string) {
        return this.http
            .get<UserSearch>(this.generateUrl(), {
                params: new HttpParams().set('name', name)
            });
    }
    getContacts() {
        return this.http
            .get<number[]>(this.generateUrl() + "/contact");
    }
    addContact(contactId: number) {
        return this.http
            .post(this.generateUrl() + "/contact",
            { "Id": contactId });
    }*/

    confirmRegistration(key: string) {
        return this.http.get(this.generateUrl() + '/confirmregistration/' + key).subscribe();
    }

    /*getUserDetails(id: number) {
        return this.http.get<UserDetail>(this.generateUrl(), {
            params: new HttpParams().set('id', id.toString())
        });
    }*/

    addUser(user: Login) {
        return this.http
            .post(this.generateUrl(),
            { "Email": user.Email, "Password": user.Password });
    }
}

