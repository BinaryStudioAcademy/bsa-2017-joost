import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpRequest, HttpParams } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import { BaseApiService } from "./base-api.service";

import { UserDetail } from "../models/user-detail";
import { UserSearch } from "../models/user-search";
import { User } from "../models/user";
import { Contact,ContactState} from "../models/contact";
import { UserContact} from "../models/user-contact";

@Injectable()
export class ContactService extends BaseApiService {

	private userSource = new BehaviorSubject<UserContact>(null);
	public changeContact = this.userSource.asObservable();

	private idContactSource = new BehaviorSubject<number>(null);
	public changeContactId = this.idContactSource.asObservable();

	constructor(http : HttpService) { 
		super(http);
		this.parUrl = "contact";
	}
	//Notify all subscribe components, when change some contact
	changeContactNotify(contact:UserContact){
		this.userSource.next(contact);
	}
	changeContactIdNotify(contactId:number){
		this.idContactSource.next(contactId);
	}
	// contacts
	getAllContacts(){
		let req = new HttpRequest("GET", this.generateUrl()+ "/contacts-detail");
		return this.http.sendRequest<UserContact[]>(req);
		//return this.http
		//.get<UserContact[]>(this.generateUrl()+ "/all-contact");
	}
	getContacts(){
		let req = new HttpRequest("GET", this.generateUrl());
		return this.http.sendRequest<Contact[]>(req);
		//return this.http
		//.get<Contact[]>(this.generateUrl()+ "/contact");
    }
    getUserIdByContactId(contactId: number) {
        let req = new HttpRequest("GET", this.generateUrl() + "/user/", {
            params: new HttpParams().set('contactId', contactId.toString())
        });
        return this.http.sendRequest<number>(req);
    }
	addContact(contactId:number){
		let req = new HttpRequest("POST", this.generateUrl(),
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
		let req = new HttpRequest("DELETE", this.generateUrl(), {
				params: new HttpParams().set('id', contactId.toString())
		});
		return this.http.sendRequest(req);
		//return this.http
		//.delete(this.generateUrl() + "/contact",{
		//	params: new HttpParams().set('id', contactId.toString())
		//});
	}
}
