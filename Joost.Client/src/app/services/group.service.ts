import { Injectable, EventEmitter } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpService } from '../services/http.service';

import { BaseApiService } from "./base-api.service";
import { Group } from "../models/group";
import { UserDetail } from "../models/user-detail";

@Injectable()
export class GroupService extends BaseApiService {

    public addGroupEvent: EventEmitter<Group>;   
    
    constructor(http: HttpService) {
        super(http);
        this.parUrl = "groups";
        this.addGroupEvent = new EventEmitter<Group>();
    }

    addGroup(newGroup: Group) {
        let req = new HttpRequest("POST", this.generateUrl(), newGroup);
        return this.http.sendRequest<Group>(req);
    }

    getGroup(id: number) {
        let req = new HttpRequest("GET", `${this.generateUrl()}/${id}`);
        return this.http.sendRequest<Group>(req);
    }

    getGroupMembers(id: number) {
        let req = new HttpRequest("GET", `${this.generateUrl()}/${id}` + "/getMembers");
        return this.http.sendRequest<UserDetail[]>(req);
    }

    putGroup(id: number, newGroup: Group) {
        let req = new HttpRequest("PUT", `${this.generateUrl()}/${id}`, newGroup);
        return this.http.sendRequest(req);        
    }

    deleteGroup(id: number) {
        let req = new HttpRequest("DELETE", `${this.generateUrl()}/${id}`);
        return this.http.sendRequest(req);
    }
}
