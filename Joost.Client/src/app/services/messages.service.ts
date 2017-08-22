import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import { HttpRequest } from '@angular/common/http';

import { BaseApiService } from "./base-api.service";
import { Dialog } from "../models/dialog";
import { Message } from "../models/message";

@Injectable()
export class MessagesService extends BaseApiService {
  constructor(http: HttpService) {
    super(http);
    this.parUrl = "messages";
  }

  public getGroupMessages(id: string, take: number, skip: number) {
    let req = new HttpRequest("GET", this.generateUrl() + `?groupId=${id}&take=${take}&skip=${skip}`);
    return this.http.sendRequest<Message[]>(req);
    //return this.http.get<Message[]>(this.generateUrl() + `?groupId=${id}&take=${take}&skip=${skip}`);
  }

  public getUsersMessages(id: string, take: number, skip: number) {
    let req = new HttpRequest("GET", this.generateUrl() + `?userId=${id}&take=${take}&skip=${skip}`);
    return this.http.sendRequest<Message[]>(req);
    //return this.http.get<Message[]>(this.generateUrl() + `?userId=${id}&take=${take}&skip=${skip}`);
  }
}
