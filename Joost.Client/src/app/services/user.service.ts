import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
//import { HttpClient,HttpParams } from '@angular/common/http';
import { HttpRequest, HttpParams } from '@angular/common/http';
import { HttpService } from '../services/http.service';

import { BaseApiService } from "./base-api.service";

import { UserDetail } from "../models/user-detail";
import { UserSearch } from "../models/user-search";
import { User } from "../models/user";
import { Contact,ContactState} from "../models/contact";
import { UserContact} from "../models/user-contact";


@Injectable()
export class UserService extends BaseApiService{
  constructor(http : HttpService) {
    super(http);
    this.parUrl = "users";
  }

  confirmRegistration(key: string) {
    let req = new HttpRequest("GET", this.generateUrl() + '/confirmregistration' ,{ params:new HttpParams().set("key",key) });
    return this.http.sendRequest(req).subscribe();
    //return this.http.get(this.generateUrl() + '/confirmregistration/' + key).subscribe();
  }

  checkUserForUniqueness(email: string) {
    debugger;
    let req = new HttpRequest("GET", this.generateUrl() + '/check', { params: new HttpParams().set("login", email) });
    return this.http.sendRequest(req);
  }

  getUserDetails(id: number){
    let req = new HttpRequest("GET", this.generateUrl(), {
      params: new HttpParams().set('id', id.toString())
    });
    return this.http.sendRequest<UserDetail>(req);
    //return this.http.get<UserDetail>(this.generateUrl(), {
    //  params: new HttpParams().set('id', id.toString())
    //});
  }
 }

