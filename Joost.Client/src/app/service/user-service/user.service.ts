import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http:HttpClient) { }

  searchResult(name:string){
  	return this.http
  	.get("http://localhost:51248/api/users",{
  		params: new HttpParams().set('name',name)
  	});
  }
  addContact(userId:number, contactId:number){
  	return this.http
  	.post("http://localhost:51248/api/users/contact",{
  		params: new HttpParams().set('UserId', userId.toString()).append('ContactId', contactId.toString())
  	});
  }

}
