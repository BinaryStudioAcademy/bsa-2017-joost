import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { ContactService } from "../../services/contact.service";

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
	private searchContact:UserContact[];
	private searchString:string;
	constructor(
		private router: Router,
		private contactService: ContactService
		) { }

	ngOnInit() {
		this.contactService.getAllContacts().subscribe(
			data=> {
				this.result = data;
				this.searchContact = this.result;
			},
			async err => {
				await this.contactService.handleTokenErrorIfExist(err).then(ok => {
					if (ok) { 
					    this.contactService.getAllContacts().subscribe(data => {
						    this.result = data;
						    this.searchContact = this.result;
					    });
				    }
				});
			}
		);
		
		this.contactService.changeContact.subscribe(
		user => {
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
			await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
					this.contactService.changeContact.subscribe(user => {
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
	search(){
		if (this.searchString!=="") {
			this.searchContact = this.result.filter(t=>t.Name.toLowerCase().includes(this.searchString.toLowerCase()));
		}
	}
	goToConfirm(id:number){
		if (this.isNewContact(id) || this.isDeclineContact(id)) {
			this.contactService.changeContactIdNotify(id);
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
					return "new_releases";
				case ContactState.Sent:
					return "person_add";
		    	default:
		    		return "";
		    }
		}
	}


}
