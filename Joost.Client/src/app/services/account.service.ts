import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpRequest, HttpParams } from '@angular/common/http';
import { HttpService } from '../services/http.service';

import { BaseApiService } from "./base-api.service";

import { UserSearch } from "../models/user-search";
import { User } from "../models/user";

@Injectable()
export class AccountService extends BaseApiService {

	constructor(http : HttpService) { 
		super(http);
		this.parUrl = "account";
	}

	getUser() {
	    let req = new HttpRequest("GET", this.generateUrl() + '/myprofile');
	    return this.http.sendRequest<User>(req)
	    //return this.http.get<User>(this.generateUrl() + '/myprofile');
	}

	updateUser(user: User) {
	    let req = new HttpRequest("PUT", this.generateUrl(), JSON.stringify(user));
	    return this.http.sendRequest<User>(req).subscribe(data => { },
	      async err => {
	        await this.http.handleTokenErrorIfExist(err).then(ok => { 
	          if (ok) this.http.sendRequest<User>(req).subscribe();
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
}
