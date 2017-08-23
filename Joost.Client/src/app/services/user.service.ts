import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
//import { HttpClient,HttpParams } from '@angular/common/http';
import { HttpRequest, HttpParams } from '@angular/common/http';
import { HttpService } from '../services/http.service';

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

	constructor(http : HttpService) {
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
    let req = new HttpRequest("GET", this.generateUrl(), {
  		params: new HttpParams().set('name',name)
    });
    return this.http.sendRequest<UserSearch[]>(req);
    //return this.http
  	//.get<UserSearch[]>(this.generateUrl(),{
  	//	params: new HttpParams().set('name',name)
  	//});
  }

  // contacts
  getAllContacts(){
    let req = new HttpRequest("GET", this.generateUrl()+ "/all-contact");
    return this.http.sendRequest<UserContact[]>(req);
    //return this.http
    //.get<UserContact[]>(this.generateUrl()+ "/all-contact");
  }
  getContacts(){
    let req = new HttpRequest("GET", this.generateUrl()+ "/contact");
    return this.http.sendRequest<Contact[]>(req);
    //return this.http
    //.get<Contact[]>(this.generateUrl()+ "/contact");
  }
  addContact(contactId:number){
    let req = new HttpRequest("POST", this.generateUrl() + "/contact",
      { "ContactId": contactId, "State": ContactState.New });
    return this.http.sendRequest(req);
  	//return this.http
  	//.post(this.generateUrl() + "/contact",
    //  {  	  "ContactId":contactId ,"State": ContactState.New 	});
  }
  confirmContact(contactId:number){
    let req = new HttpRequest("POST", this.generateUrl() + "/confirm-contact",
      { "ContactId":contactId ,"State": ContactState.Accept });
    return this.http.sendRequest(req);
     //return this.http
    //.post(this.generateUrl() + "/confirm-contact",
     // {      "ContactId":contactId ,"State": ContactState.Accept });
  }
  declineContact(contactId:number){
    let req = new HttpRequest("POST", this.generateUrl() + "/decline-contact", { 
      "ContactId": contactId ,"State": ContactState.Decline });
    return this.http.sendRequest(req);
    //.post(this.generateUrl() + "/decline-contact",
    //  {      "ContactId":contactId ,"State": ContactState.Decline });
  }
  deleteContact(contactId:number){
    let req = new HttpRequest("DELETE", this.generateUrl() + "/contact", {
  		params: new HttpParams().set('id', contactId.toString())
    });
    return this.http.sendRequest(req);
  	//return this.http
  	//.delete(this.generateUrl() + "/contact",{
  	//	params: new HttpParams().set('id', contactId.toString())
  	//});
  }

  confirmRegistration(key: string) {
      let req = new HttpRequest("GET", this.generateUrl() + '/confirmregistration' ,{ params:new HttpParams().set("key",key) });
      return this.http.sendRequest(req).subscribe();
      //return this.http.get(this.generateUrl() + '/confirmregistration/' + key).subscribe();
  }

  checkUserForUniqueness(email: string) {
      debugger;
      let req = new HttpRequest("GET", this.generateUrl() + '/check', { params: new HttpParams().set("login", email) });
      return this.http.sendRequest(req);
  }

   getUserDetails(id: number){
    let req = new HttpRequest("GET", this.generateUrl(), {
      params: new HttpParams().set('id', id.toString())
    });
    return this.http.sendRequest<UserDetail>(req);
    //return this.http.get<UserDetail>(this.generateUrl(), {
    //  params: new HttpParams().set('id', id.toString())
    //});
  }
    
  getUser() {
    let req = new HttpRequest("GET", this.generateUrl() + '/myprofile');
    return this.http.sendRequest<User>(req)
    //return this.http.get<User>(this.generateUrl() + '/myprofile');
  }
  
  updateUser(user: User) {
    let req = new HttpRequest("PUT", this.generateUrl() + '/' + user.Id.toString(), JSON.stringify(user));
    return this.http.sendRequest<User>(req).subscribe(data => { },
      async err => {
        await this.http.handleTokenErrorIfExist(err).then(ok => { 
          if (ok) this.http.sendRequest<User>(req).subscribe();
      });
      }
    );
    //return this.http.put<User>(this.generateUrl() + '/' + user.Id.toString(), JSON.stringify(user)).subscribe();
  }

  
}

