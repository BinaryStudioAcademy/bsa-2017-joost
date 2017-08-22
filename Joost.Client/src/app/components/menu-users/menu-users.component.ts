import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

import { UserSearch } from "../../models/user-search";
import { Contact,ContactState} from "../../models/contact";
import { UserContact} from "../../models/user-contact";

@Component({
  selector: 'app-menu-users',
  templateUrl: './menu-users.component.html',
  styleUrls: ['./menu-users.component.scss']
})
export class MenuUsersComponent implements OnInit {

	private result:UserContact[];
	constructor(private userService: UserService,private router: Router,private authService: AuthenticationService) { }

	ngOnInit() {
		this.userService.getAllContacts().subscribe(data=> this.result = data,
			async err => {
				await this.userService.handleTokenErrorIfExist(err).then(ok => {
					if (ok) { 
					    this.userService.getAllContacts().subscribe(data => {
						    this.result = data
					    });
				    }
				});
			}
		);

		this.userService.changeContact.subscribe(user=>{
			if (user) {
				let contact = this.result.filter(t=>t.Id==user.Id)[0];
				if (contact!==undefined) {
					contact.State = user.State;
				}
				else{
					if (user.State==ContactState.Decline) {
						this.result.splice(this.result.indexOf(user), 1);
					}
					else {
						this.result.push(user);
					}
				}
				this.result.sort(this.compareUserContact);
			}
		},
	    async err => {
			await this.userService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
					this.userService.changeContact.subscribe(user => {
					    if (user) {
						    let contact = this.result.filter(t=>t.Id==user.Id)[0];
						    if (contact!==undefined) {
						    	contact.State = user.State;
						    }
						    else{
						    	if (user.State==ContactState.Decline) {
						    		this.result.splice(this.result.indexOf(user), 1);
						    	}
						    	else {
						    		this.result.push(user);
						    	}
						    }
						    this.result.sort(this.compareUserContact);
					    }
				    });
			    }
			});
		});
	}
	ngOnDestroy() {
		this.authService.logout();
	}
	goToConfirm(id:number){
		if (this.isNewContact(id) || this.isDeclineContact(id)) {
			this.userService.changeContactIdNotify(id);
			this.router.navigate(['menu/add-contact']);
		}
	}
	compareUserContact(a:UserContact,b:UserContact):number{
		if (a.State < b.State) {
		  return -1;
		}
		if (a.State > b.State) {
		  return 1;
		}
		return 0;
	}
	isNewContact(id:number):boolean{
		return this.result.filter(t=>t.Id==id)[0].State===ContactState.New;
	}
	isDeclineContact(id:number):boolean{
		return this.result.filter(t=>t.Id==id)[0].State===ContactState.Decline;
	}
	ContactStatus(id:number):string{
		let state =  this.result.filter(t=>t.Id==id)[0];
		if (state) {
			switch (state.State) {
				case ContactState.New:
					return "fiber_new";
				case ContactState.Sent:
					return "trending_flat";
				case ContactState.Decline:
					return "not_interested";
				case ContactState.Accept:
					return "check_circle";
		    	default:
		    		return "trending_flat";
		    }
		}
	}


}
