import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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
	constructor(private userService: UserService,private router: Router, private route: ActivatedRoute) { }

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
		this.router.navigate(["/"]);
	}
	accept(id:number){
		this.userService.confirmContact(id).subscribe();
		this.router.navigate(["/"]);

	}
	decline(id:number){
		this.userService.declineContact(id).subscribe();
		this.router.navigate(["/"]);
	}
}
