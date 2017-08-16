import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserDetail } from "../../models/user-detail";
import { UserState } from "../../models/user-detail";
import { Gender } from "../../models/user-detail";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-user-editing',
  templateUrl: './user-editing.component.html',
  styleUrls: ['./user-editing.component.scss']
})
export class UserEditingComponent implements OnInit {

  user: UserDetail;
  userId: number; // initialize from router on init

  constructor(
    private userService: UserService,
    public route: ActivatedRoute, 
    private location: Location) {
   }

  ngOnInit() {
    this.userId = this.route.snapshot.params.id;
    this.GetUser();
  }

  SaveUser() {
      this.userService.updateUserDetails(this.user);
      this.location.back();
  }

  GetUser() {
    this.userService.getUserDetails(this.userId).subscribe( d => {
      this.user = d;
      console.log(d);
      console.log(this.user);
    });
  }

  Cancel() {
     this.location.back();
  }



}
