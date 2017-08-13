import { Component, OnInit } from '@angular/core';
import { Location }                 from '@angular/common';

import { UserService } from "../../services/user.service";
import { AuthenticationService } from "../../services/authentication.service";
import { UserDetail } from "../../models/user-detail";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user: UserDetail = null;
  constructor(
    private location: Location,
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authService.getUserId().subscribe( data => {
        this.userService.getUserDetails(data).subscribe( d => {
          this.user = d;
          console.log(d);
          console.log(this.user);
         });
    });
  }

  goBack(): void {
    this.location.back();
  }
}
