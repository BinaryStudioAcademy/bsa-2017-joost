import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { HttpService } from '../services/http.service';
import { HttpRequest } from '@angular/common/http';
import { Dialog } from '../models/dialog';

@Injectable()
export class DialogService extends BaseApiService {

  constructor(http: HttpService) {
    super(http);
    this.parUrl = "dialogs";
  }

  getDialogs(): Observable<Dialog[]> {
    let req = new HttpRequest("GET", this.generateUrl());
    return this.http.sendRequest<Dialog[]>(req);
  }

}
