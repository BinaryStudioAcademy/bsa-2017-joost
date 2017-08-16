import { Component, OnInit,OnDestroy } from '@angular/core';

import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

import { UserSearch } from "../../models/user-search";
import { Contact,ContactState} from "../../models/contact";

@Component({
  selector: 'app-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.scss']
})
export class MenuSearchComponent implements OnInit,OnDestroy {

    private result:UserSearch;
	private searchString:string;
	private isLoad:boolean = false;
	private contactList:Contact[];

	constructor(private userService: UserService,private authService: AuthenticationService) { }

	ngOnInit() {
		this.userService.getContacts().subscribe(data=>this.contactList= data);
	}
	ngOnDestroy() {
		this.authService.logout();
	}
	search(){
		this.userService.getContacts().subscribe(data=>this.contactList= data);
		this.isLoad = false;
		if (this.searchString) {
			this.userService
			.searchResult(this.searchString)
			.subscribe(data =>{
					this.result = data;
					this.isLoad = true;
				});
		}
		this.result = null;
		
	}
	addToContact(contactId:number){
		this.userService.addContact(contactId).subscribe(succes=>{
			this.contactList.push(new Contact(contactId,ContactState.Sent))
		});
		this.search();
	}
	checkInContact(id:number):boolean{
		return this.contactList.map(t=>t.ContactId).indexOf(id) > -1 ;
	}
	findContact(id:number):string{
		let state =  this.contactList.filter(t=>t.ContactId==id)[0];
		if (state) {
			switch (state.State) {
				case ContactState.Accept:
					return "check_circle";
		    	default:
		    		return "trending_flat";
		    }
		}
	}
}
