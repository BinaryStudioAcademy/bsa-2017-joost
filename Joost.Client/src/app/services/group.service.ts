import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpService } from '../services/http.service';

import { BaseApiService } from "./base-api.service";
import { Group } from "../models/group";

@Injectable()
export class GroupService extends BaseApiService {
    //headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');

    constructor(http: HttpService) {
        super(http);
        this.parUrl = "groups";
    }

    addGroup(newGroup: Group) {
        let req = new HttpRequest("POST", this.generateUrl(), newGroup);
        return this.http.sendRequest(req);
        //return this.http.post(this.generateUrl(), newGroup,
        //    { headers: this.headers });
    }
    getGroup(id: number) {
        let req = new HttpRequest("GET", `${this.generateUrl()}/${id}`);
        return this.http.sendRequest<Group>(req);
        //return this.http.get<Group>(`${this.generateUrl()}/${id}`);
    }
    putGroup(id: number, newGroup: Group) {
        let req = new HttpRequest("PUT", `${this.generateUrl()}/${id}`, newGroup);
        return this.http.sendRequest(req);        
        //return this.http.put(`${this.generateUrl()}/${id}`, newGroup,
        //    { headers: this.headers });
    }
    deleteGroup(id: number) {
        let req = new HttpRequest("DELETE", `${this.generateUrl()}/${id}`);
        return this.http.sendRequest(req);
        //return this.http.delete(`${this.generateUrl()}/${id}`);
    }
}
