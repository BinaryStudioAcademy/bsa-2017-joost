import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { MDL } from '../mdl-base.component';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends MDL implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }

  onNotificationsForUsers() {

  }

  onNotificationsForGroups() {

  }
}
