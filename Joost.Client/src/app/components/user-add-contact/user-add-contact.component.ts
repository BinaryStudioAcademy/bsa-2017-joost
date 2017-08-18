import { Component, OnInit, Input } from '@angular/core';
import { Router} from '@angular/router';
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
export class UserAddContactComponent implements OnInit{
	@Input()
	private userId:number;
	private isError?:boolean = null;
	private isLoad:boolean =false;
	private contact: UserContact;
	constructor(
		private userService: UserService,
		private router: Router,
		private location: Location
	) { }

	ngOnInit() {
		this.isError = null;
		this.isLoad = false;
		this.userService.changeContactId.subscribe(id =>{
			this.userService.getAllContacts().subscribe(
			data =>{
				this.contact = data.filter(t=>t.Id==id)[0];
				this.isLoad = true;
			},
			error => {
				this.isError = true;
			}
		);
		});
	}
	
	goBack(){
		// this.location.back();
		this.router.navigate(["menu"]);
	}
	accept(id:number){
		this.userService.confirmContact(id).subscribe(ok =>{
			this.router.navigate(["menu"]);
			this.contact.State = ContactState.Accept;
			this.userService.changeContactNotify(this.contact);
		});
	}
	decline(id:number){
		this.userService.declineContact(id).subscribe(ok=>{
			this.router.navigate(["menu"]);
			this.contact.State = ContactState.Decline;
			this.userService.changeContactNotify(this.contact);
		});
	}
	retry(id:number){
		this.userService.addContact(id).subscribe(succes=>{
			this.router.navigate(["menu"]);
			this.contact.State = ContactState.Sent;
			this.userService.changeContactNotify(this.contact);
		});
	
	}
}
