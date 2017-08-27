import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpRequest, HttpParams, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../services/http.service';

import { BaseApiService } from "./base-api.service";

import { UserSearch } from "../models/user-search";
import { User } from "../models/user";
import { UserProfile } from "../models/user-profile";

@Injectable()
export class AccountService extends BaseApiService {

	constructor(http : HttpService) { 
		super(http);
		this.parUrl = "account";
	}

  getUser() {
    let req = new HttpRequest("GET", this.generateUrl() + '/myprofile');
    return this.http.sendRequest<UserProfile>(req)
    
    //return this.http.get<User>(this.generateUrl() + '/myprofile');
  }
  
  updateUser(user: UserProfile) {
    let req = new HttpRequest("PUT", this.generateUrl() + '/myprofile', JSON.stringify(user));
    return this.http.sendRequest<UserProfile>(req).subscribe(data => { },
      async err => {
        await this.http.handleTokenErrorIfExist(err).then(ok => { 
          if (ok) this.http.sendRequest<UserProfile>(req).subscribe();
      });
      }
    );    
    //return this.http.put<User>(this.generateUrl() + '/' + user.Id.toString(), JSON.stringify(user)).subscribe();
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

  updateStatus(newStatus: string){
    const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json;charset=utf8');
    const request = new HttpRequest<string>("POST", 
      `${this.generateUrl()}/updatestatus`, 
      JSON.stringify(newStatus),
      { headers: httpHeaders }
    );
    return this.http.sendRequest(request);
  }

  getNotificationFromUsers() {
      let req = new HttpRequest("GET", this.generateUrl() + '/notificationsfromusers');
      return this.http.sendRequest<boolean>(req);
  }

  getNotificationFromGroups() {
      let req = new HttpRequest("GET", this.generateUrl() + '/notificationsfromgroups');
      return this.http.sendRequest<boolean>(req);
  }

  updateNotificationFromUsers(notification: boolean) {
      let req = new HttpRequest("PUT", this.generateUrl() + '/notificationsfromusers', JSON.stringify(notification));
      return this.http.sendRequest<boolean>(req).subscribe(data => { return true; });
  }

  updateNotificationFromGroups(notification: boolean) {
      let req = new HttpRequest("PUT", this.generateUrl() + '/notificationsfromgroups', JSON.stringify(notification));
      return this.http.sendRequest<boolean>(req).subscribe(data => { return true; });
  }
}
