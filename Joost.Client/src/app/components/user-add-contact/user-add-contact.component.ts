import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserContact } from "../../models/user-contact";
import { ContactState} from "../../models/contact";
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-user-add-contact',
  templateUrl: './user-add-contact.component.html',
  styleUrls: ['./user-add-contact.component.scss'],
})
export class UserAddContactComponent implements OnInit {

	private userId:number;
	private isLoad:boolean;
	private contact: UserContact;
	constructor(
		private userService: UserService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location
		) { }

	ngOnInit() {
		this.isLoad =false;
		this.route.params.subscribe(params => {
	    	this.userId = params['id'];
	  	});
		this.userService.getAllContacts().subscribe(data =>{
			this.contact = data.filter(t=>t.Id==this.userId)[0];
			this.isLoad = true;
		});
	}
	goBack(){
		this.location.back();
	}
	accept(id:number){
		this.userService.confirmContact(id).subscribe(ok =>{
			this.location.back();
			this.contact.State = ContactState.Accept;
			this.userService.changeContactNotify(this.contact);
		});
	}
	decline(id:number){
		this.userService.declineContact(id).subscribe(ok=>{
			this.location.back();
			this.contact.State = ContactState.Decline;
			this.userService.changeContactNotify(this.contact);
		});
	}
}
