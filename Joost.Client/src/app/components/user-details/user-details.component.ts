import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from "rxjs/Observable";
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { UserService } from "../../services/user.service";
import { UserDetail } from "../../models/user-detail";

import { MDL } from '../mdl-base.component';
declare var componentHandler: any;
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent extends MDL implements OnInit {

  
  user: UserDetail;
  private isLoadFinished:boolean = false;
  private isError:boolean = false;
  private isFriend = false;

  constructor(
    private location: Location,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {

    this.route.paramMap
      .switchMap((params: ParamMap) => this.userService.getUserDetails(+params.get('id')))
      .subscribe(user => {
        this.user = user;
        this.isLoadFinished = true;
        this.checkInContact(user.Id);
      },
      err=> {
        this.isError = true;
        console.log(this.isError);
      }
    );
  }

  addToContact(contactId:number){
		this.userService.addContact(contactId).subscribe(() =>{
      this.isFriend = true;
		});
  }

  deleteFromContact(contactId:number){
		this.userService.deleteContact(contactId).subscribe(() =>{
      this.isFriend = false;
		});
  }
  
	checkInContact(id:number):void {
		this.userService.getContacts().subscribe( list => {
      this.isFriend = list.map(t=>t.ContactId).indexOf(id) >= 0;
    });
	}

  goBack(): void {
    this.location.back();
  }

  contactActionClick(id: number):void {
    if(this.isFriend)
      this.deleteFromContact(id);
    else
      this.addToContact(id);
  }
}
