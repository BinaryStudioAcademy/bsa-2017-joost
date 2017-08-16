import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

import { BaseApiService } from "./base-api.service";
import { Group } from "../models/group";

@Injectable()
export class GroupService extends BaseApiService{
  headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');

  constructor(http : HttpClient) {
		super(http);
		this.parUrl = "groups";
	}

  addGroup(newGroup: Group){
    return this.http.post(this.generateUrl(), newGroup, 
      {headers: this.headers});
  }

}
