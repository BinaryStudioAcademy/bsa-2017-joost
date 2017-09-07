import { Component, OnInit, Input } from '@angular/core';
import { Router} from '@angular/router';
import { Location } from '@angular/common';
import { ContactService } from "../../services/contact.service";
import { UserContact } from "../../models/user-contact";
import { ContactState} from "../../models/contact";
import { AuthenticationService } from '../../services/authentication.service';
import { MDL } from "../mdl-base.component";
import { EventEmitterService } from "../../services/event-emitter.service";

@Component({
  selector: 'app-user-add-contact',
  templateUrl: './user-add-contact.component.html',
  styleUrls: ['./user-add-contact.component.scss'],
})
export class UserAddContactComponent extends MDL implements OnInit{
	@Input()
	private userId:number;
	private isError?:boolean = null;
	private isLoad:boolean =false;
	private contact: UserContact;
	constructor(
		private router: Router,
        private location: Location,
        private eventEmitterService: EventEmitterService,
		private contactService: ContactService
	) {
		super();
	}

    ngOnInit() {
		this.isError = null;
		this.isLoad = false;
        this.contactService.changeContactId.subscribe(id => {
			this.contactService.getAllContacts().subscribe(
			data =>{
				this.contact = data.filter(t=>t.Id==id)[0];
				this.isLoad = true;
			},
            async err => {
				await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
					if (ok) {
					  this.contactService.getAllContacts().subscribe(data => {
						  this.contact = data.filter(t=>t.Id==id)[0];
						  this.isLoad = true;
					  },
				      error => {
						  this.isError = true;
					  });
				  }
				});
				this.isError = true;
			}
		);
		},
	    async err => {
			await this.contactService.handleTokenErrorIfExist(err).then(ok => {
				if (ok) { 
  				this.contactService.changeContactId.subscribe(id => {
  					this.contactService.getAllContacts().subscribe(
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
			});
		});
	}
	
	goBack(){
		// this.location.back();
		this.router.navigate(["menu"]);
	}
	accept(id:number){
		this.contactService.confirmContact(id).subscribe(ok =>{
			this.router.navigate(["menu"]);
			this.contact.State = ContactState.Accept;
            this.contactService.changeContactNotify(this.contact);
            this.eventEmitterService.removeNewContact.emit(this.contact); 
		},
	    async err=> {
			await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
			    this.contactService.confirmContact(id).subscribe(ok => {
				  this.router.navigate(["menu"]);
				  this.contact.State = ContactState.Accept;
				  this.contactService.changeContactNotify(this.contact);
			  	});
			  }
			});
		});
	}
	decline(id:number){
		this.contactService.declineContact(id).subscribe(ok=>{
			this.router.navigate(["menu"]);
			this.contact.State = ContactState.Decline;
			this.contactService.changeContactNotify(this.contact);
		},
	    async err=> {
			await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
			    this.contactService.declineContact(id).subscribe(ok => {
				  this.router.navigate(["menu"]);
				  this.contact.State = ContactState.Decline;
				  this.contactService.changeContactNotify(this.contact);
				  });
			  }
			});
		});
	}
	retry(id:number){
		this.contactService.addContact(id).subscribe(succes=>{
			this.router.navigate(["menu"]);
			this.contact.State = ContactState.Sent;
			this.contactService.changeContactNotify(this.contact);
		},
		async err=> {
			await this.contactService.handleTokenErrorIfExist(err).then(ok => { 
				if (ok) {
			    this.contactService.addContact(id).subscribe(succes => {
				  this.router.navigate(["menu"]);
				  this.contact.State = ContactState.Sent;
				  this.contactService.changeContactNotify(this.contact);
				  });
			  }
			});
		});
	}
}
