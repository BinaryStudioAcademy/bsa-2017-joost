import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { BaseApiService } from "./base-api.service";

@Injectable()
export class UserService extends BaseApiService{

	constructor(http : HttpClient) {
		super(http);
		this.parUrl = "users";
	}

  searchResult(name:string){
  	return this.http
  	.get(this.generateUrl(),{
  		params: new HttpParams().set('name',name)
  	});
  }
  addContact(userId:number, contactId:number){
  	return this.http
  	.post(this.generateUrl() + "/contact",{
  		params: new HttpParams().set('UserId', userId.toString()).append('ContactId', contactId.toString())
  	});
  }

}
