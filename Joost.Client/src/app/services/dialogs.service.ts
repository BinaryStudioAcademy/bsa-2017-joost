import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BaseApiService } from "./base-api.service";
import { Dialog } from "../models/dialog";

@Injectable()
export class DialogsService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
    this.parUrl = "dialogs";
  }

  public getAllDialogs() {
    return this.http.get<Dialog[]>(this.generateUrl());
  }
}
