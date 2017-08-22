import { Component, OnInit,OnDestroy } from '@angular/core';

import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

import { UserSearch } from "../../models/user-search";
import { Contact,ContactState} from "../../models/contact";
import { UserContact} from "../../models/user-contact";

@Component({
  selector: 'app-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.scss']
})
export class MenuSearchComponent implements OnInit,OnDestroy {

    private result:UserSearch[];
	private searchString:string;
	private isLoad:boolean = false;
	private contactList:Contact[];

	constructor(private userService: UserService,private authService: AuthenticationService) { }

	ngOnInit() {
		this.userService.getContacts().subscribe(data=>this.contactList = data,
			async err => {
                await this.userService.handleTokenErrorIfExist(err).then(ok => { 
					if (ok) {
                        this.userService.getContacts().subscribe(data => {                
                            this.contactList = data;
					    });
				    }
                });
            }
		);
		this.userService.changeContact.subscribe(user=>{
			if (user) {
				let contact = this.contactList.filter(t=>t.ContactId==user.Id)[0];
				if (contact!==undefined) {
					contact.State = user.State;
				}
				else if (user.State==ContactState.Decline) {
					let currUser = this.contactList.filter(t=>t.ContactId==user.Id)[0];
					this.contactList.splice(this.contactList.indexOf(currUser), 1);
				}
				else {
					this.contactList.push(new Contact(user.Id,user.State));
				}
			}
		},
	    async err => {
			await this.userService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
				this.userService.changeContact.subscribe(user => {                
			     	if (user) {
				    		let contact = this.contactList.filter(t=>t.ContactId==user.Id)[0];
				    		if (contact!==undefined) {
				    			contact.State = user.State;
				    		}
				    		else if (user.State==ContactState.Decline) {
			     				let currUser = this.contactList.filter(t=>t.ContactId==user.Id)[0];
			    				this.contactList.splice(this.contactList.indexOf(currUser), 1);
			    			}
			    			else {
			    				this.contactList.push(new Contact(user.Id,user.State));
				    		}
					    }
				    });
			    }
			});
		});
	}
	ngOnDestroy() {
		this.authService.logout();
	}
	search(){
		this.userService.getContacts().subscribe(data=>{
			this.contactList= data;
		},
	    async err => {
			await this.userService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
				    this.userService.getContacts().subscribe(data => {                
					    this.contactList = data;
				    });
			    }
			});
		});

		this.isLoad = false;
		if (this.searchString) {
			this.userService
			.searchResult(this.searchString)
			.subscribe(data =>{
					this.result = data;
					this.isLoad = true;
			},
		    async err => {
                await this.userService.handleTokenErrorIfExist(err).then(ok => { 
					if (ok) {
                        this.userService
						.searchResult(this.searchString).subscribe(data => {                
                            this.result = data;
						    this.isLoad = true;
					    });
				    }
                });
            });
		}
		this.result = null;
		
	}
	addToContact(contactId:number){
		this.userService.addContact(contactId).subscribe(succes=>{
			let userInfo = this.result.filter(t=>t.Id==contactId)[0];
			let newContact = new UserContact();
			newContact.Id = contactId;
			newContact.Name= userInfo.Name;
			newContact.City= userInfo.City;
			newContact.Avatar = userInfo.Avatar;
			newContact.State = ContactState.Sent;
			this.userService.changeContactNotify(newContact);
		},
	    async err => {
			await this.userService.handleTokenErrorIfExist(err).then(ok => {
				if (ok) { 
		    		this.userService.addContact(contactId).subscribe(succes => {                
		    			let userInfo = this.result.filter(t=>t.Id==contactId)[0];
			    		let newContact = new UserContact();
			    		newContact.Id = contactId;
			    		newContact.Name= userInfo.Name;
					    newContact.City= userInfo.City;
				    	newContact.Avatar = userInfo.Avatar;
			    		newContact.State = ContactState.Sent;
				    	this.userService.changeContactNotify(newContact);
			    	});
		     	}
			});
		});
	}
	checkInContact(id:number):boolean{
		return this.contactList.map(t=>t.ContactId).indexOf(id) > -1 ;
	}
	findContact(id:number):string{
		let state =  this.contactList.filter(t=>t.ContactId==id)[0];
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
