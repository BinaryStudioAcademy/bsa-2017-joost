import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import { HttpRequest } from '@angular/common/http';

import { BaseApiService } from "./base-api.service";
import { Dialog } from "../models/dialog";

@Injectable()
export class DialogsService extends BaseApiService {
  constructor(http: HttpService) {
    super(http);
    this.parUrl = "dialogs";
  }

  public getAllDialogs() {
    let req = new HttpRequest("GET", this.generateUrl());
    return this.http.sendRequest<Dialog[]>(req);
    //return this.http.get<Dialog[]>(this.generateUrl());
  }
}
