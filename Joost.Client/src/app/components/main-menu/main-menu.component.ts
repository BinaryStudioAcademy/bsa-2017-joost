import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from "../../services/account.service";

import { MDL } from "../mdl-base.component";
import { UserProfile } from "../../models/user-profile";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent extends MDL implements OnInit {

  private curUser: UserProfile; 
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private accountService: AccountService) {
      super();
  }

  ngOnInit() {
    this.accountService.getUser().subscribe(data => {
      this.curUser = data;
    },
    async error => {
      await this.accountService.handleTokenErrorIfExist(error).then( ok => {
        if(ok) {
          this.accountService.getUser().subscribe(data => this.curUser = data);
        }
      })
    });
  }

  onCreateGroup(){
    this.router.navigate(["groups/new"], { relativeTo: this.route });
  }
}
