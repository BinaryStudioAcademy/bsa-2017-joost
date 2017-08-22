import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient,HttpParams } from '@angular/common/http';

import { BaseApiService } from "./base-api.service";

import { UserDetail } from "../models/user-detail";
import { UserSearch } from "../models/user-search";
import { User } from "../models/user";
import { Contact,ContactState} from "../models/contact";
import { UserContact} from "../models/user-contact";


@Injectable()
export class UserService extends BaseApiService{

  private userSource = new BehaviorSubject<UserContact>(null);
  changeContact = this.userSource.asObservable();

  private idContactSource = new BehaviorSubject<number>(null);
  changeContactId = this.idContactSource.asObservable();

	constructor(http : HttpClient) {
		super(http);
		this.parUrl = "users";
	}
  //Notify all subscribe components, when change some contact
  changeContactNotify(contact:UserContact){
    this.userSource.next(contact);
  }
   changeContactIdNotify(contactId:number){
    this.idContactSource.next(contactId);
  }
  searchResult(name:string){
  	return this.http
  	.get<UserSearch[]>(this.generateUrl(),{
  		params: new HttpParams().set('name',name)
  	});
  }

  // contacts
  getAllContacts(){
    return this.http
    .get<UserContact[]>(this.generateUrl()+ "/all-contact");
  }
  getContacts(){
    return this.http
    .get<Contact[]>(this.generateUrl()+ "/contact");
  }
  addContact(contactId:number){
  	return this.http
  	.post(this.generateUrl() + "/contact",
      {  	  "ContactId":contactId ,"State": ContactState.New 	});
  }
  confirmContact(contactId:number){
     return this.http
    .post(this.generateUrl() + "/confirm-contact",
      {      "ContactId":contactId ,"State": ContactState.Accept });
  }
  declineContact(contactId:number){
     return this.http
    .post(this.generateUrl() + "/decline-contact",
      {      "ContactId":contactId ,"State": ContactState.Decline });
  }
  deleteContact(contactId:number){
  	return this.http
  	.delete(this.generateUrl() + "/contact",{
  		params: new HttpParams().set('id', contactId.toString())
  	});
  }

  confirmRegistration(key: string) {
      return this.http.get(this.generateUrl() + '/confirmregistration/' + key).subscribe();
  }

  checkUserForUniqueness(email: string) {
      return this.http.get(this.generateUrl() + '/check/' + email);
  }

   getUserDetails(id: number){
    return this.http.get<UserDetail>(this.generateUrl(), {
      params: new HttpParams().set('id', id.toString())
    });
  }
    
  getUser() {
    return this.http.get<User>(this.generateUrl() + '/myprofile');
  }
  
  updateUser(user: User) {
    return this.http.put<User>(this.generateUrl() + '/' + user.Id.toString(), JSON.stringify(user)).subscribe();
  }

  
}

