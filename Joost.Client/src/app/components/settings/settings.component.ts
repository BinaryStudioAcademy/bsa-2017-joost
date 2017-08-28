import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Router, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { MDL } from '../mdl-base.component';
import { AuthenticationService } from "../../services/authentication.service";
import { AccountService } from "../../services/account.service";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends MDL implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService, private accountService: AccountService) {
      super();
  }
  notificationFromUsers: boolean;
  notificationFromGroups: boolean;

  ngOnInit() {
      this.accountService.getNotificationFromUsers().subscribe(data => { this.notificationFromUsers = data; });
      this.accountService.getNotificationFromGroups().subscribe(data => { this.notificationFromGroups = data; });
  }

  onNotificationsFromUsers() {
      this.accountService.updateNotificationFromUsers(this.notificationFromUsers);
  }

  onNotificationsFromGroups() {
      this.accountService.updateNotificationFromGroups(this.notificationFromGroups);
  }

  logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
  }
}
