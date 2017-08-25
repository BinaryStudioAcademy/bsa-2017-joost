import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Router, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { MDL } from '../mdl-base.component';
import { AuthenticationService } from "../../services/authentication.service";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends MDL implements OnInit {

    constructor(private router: Router, private authService: AuthenticationService) {
        super();
    }

  ngOnInit() {
  }

  onNotificationsForUsers() {

  }

  onNotificationsForGroups() {

  }

  logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
  }
}
