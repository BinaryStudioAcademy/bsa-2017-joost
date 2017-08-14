import { Component, OnInit,OnDestroy } from '@angular/core';

import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';

import { UserSearch } from "../../models/user-search";

@Component({
  selector: 'app-menu-search',
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.scss']
})
export class MenuSearchComponent implements OnInit,OnDestroy {

    private result:UserSearch;
	private searchString:string;
	private isLoad:boolean = false;
	private contactList:number[];

	constructor(private userService: UserService,private authService: AuthenticationService) { }

	ngOnInit() {
		this.authService.login("straber@ukr.net","password");
		this.userService.getContacts().subscribe(data=>this.contactList= data);
	}
	ngOnDestroy() {
		this.authService.logout();
	}
	search(){
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
			this.contactList.push(contactId)
		});
		this.search();
	}
	checkInContact(id:number):boolean{
		if (this.contactList.indexOf(id)<0) {
			return false;
		}
		return true;
	}
}
