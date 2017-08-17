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
		this.authService.login("straber@ukr.net","password");
		this.userService.getAllContacts().subscribe(data=>this.result = data);
	}
	ngOnDestroy() {
		this.authService.logout();
	}
	goToConfirm(id:number){
		if (this.isNewContact(id)) {
			this.router.navigate(['/add-contact',id]);
		}
	}
	isNewContact(id:number):boolean{
		return this.result.filter(t=>t.Id==id)[0].State===ContactState.New;
	}
	ContactStatus(id:number):string{
		let state =  this.result.filter(t=>t.Id==id)[0];
		if (state) {
			switch (state.State) {
				case ContactState.New:
					return "new_releases";
				case ContactState.Sent:
					return "trending_flat";
				// case ContactState.Accept:
				// 	return "check_circle";
				case ContactState.Decline:
					return "not_interested";
		    	default:
		    		return "";
		    }
		}
	}


}
