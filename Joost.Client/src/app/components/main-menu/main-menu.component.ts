import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from "../../services/authentication.service";
import { UserService } from "../../services/user.service";

import { UserDetail } from "../../models/user-detail";

declare var componentHandler: any;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  private curUser: UserDetail; 
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.getUserId().subscribe(data => {
      this.userService.getUserDetails(data).subscribe( d => this.curUser = d);
    });
    componentHandler.upgradeDom();
  }

  onCreateGroup(){
    this.router.navigate(["groups/new"], { relativeTo: this.route });
  }
}
