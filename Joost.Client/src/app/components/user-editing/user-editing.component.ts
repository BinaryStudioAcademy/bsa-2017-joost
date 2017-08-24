import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserProfile } from "../../models/user-profile";
import { UserService } from "../../services/user.service";
import { AccountService } from "../../services/account.service";
import { AvatarService } from "../../services/avatar.service";
import { AvatarPipe} from "../../pipes/avatar.pipe";
import { NamePipe } from "../../pipes/name.pipe";
import { MDL } from "../mdl-base.component";

import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-user-editing',
  templateUrl: './user-editing.component.html',
  styleUrls: ['./user-editing.component.scss']
})

export class UserEditingComponent extends MDL implements OnInit {

  user: UserProfile;
  private isLoadFinished:boolean = false;
  private passwordDiv: boolean = false;
  private errorPasswordDiv: boolean = false;
  private errorPasswordDivMessage: string;

  private passwordOld: string = "";
  private passwordFirst: string = "";
  private passwordSecond: string = "";

  private datePickerValue : any;
  private datePickerOptions: IMyDpOptions = {
    dateFormat: 'dd.mm.yyyy',
    showTodayBtn: false,
    minYear: 1990,
    maxYear: 2017,
    editableDateField: true
  };

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private avatarService: AvatarService,
    public router: Router,
    private location: Location
  ) {
    super();
  }

  ngOnInit() {
    this.GetUser();
  }

  SaveUser() {
    this.user.BirthDate = new Date(this.datePickerValue.date.year, this.datePickerValue.date.month-1, this.datePickerValue.date.day+1);
    this.accountService.updateUser(this.user);
    
    this.router.navigate(['menu']);
    //location.reload();
  }

  GetUser() {
    this.accountService.getUser().subscribe( d => {
      this.user = d;
      this.getUserBirthDate();
      this.isLoadFinished = true;
    },
    async err=> {
      await this.userService.handleTokenErrorIfExist(err).then(ok => { 
        if (ok) {
          this.accountService.getUser().subscribe(d => {
            this.user = d;
            this.getUserBirthDate();
            this.isLoadFinished = true;
          },
          err => {
            
          });
        }
      });
    });
  }

  Cancel() {
     this.router.navigate(['menu']);
  }

  ChangePassword() {
    
    if(this.passwordOld == "" || this.passwordFirst == "" || this.passwordSecond == "") {
      this.errorPasswordDivMessage = "One of the inputs is empty.";
      this.errorPasswordDiv = true;
      return;
    }
    else{
      if(this.passwordOld != this.user.Password) {
        this.errorPasswordDivMessage = "Wrong previous password.";
        this.errorPasswordDiv = true;
        return;
      }
      else {
        if(this.passwordFirst != this.passwordSecond) {
          this.errorPasswordDivMessage = "Passwords do not match.";
          this.errorPasswordDiv = true;
          return;
        }
        else {
          this.user.Password = this.passwordFirst;
          this.accountService.updateUser(this.user);
          this.passwordDiv = false;
        }
      }
    }
  }
  
  CancelPassword() {
    this.passwordDiv = !this.passwordDiv;
    this.passwordOld = this.passwordFirst = this.passwordSecond ="";
    this.errorPasswordDiv = false;
  }
  
  SendAvatar(e: Event) {
    var target: HTMLInputElement = e.target as HTMLInputElement;
    this.avatarService.SetAvatar(target.files[0]);
    location.reload();
  }

  getUserBirthDate() { // convertung date from server to date for datePicker
    let receivedDate = new Date(this.user.BirthDate);
    this.datePickerValue = {  date: { year: +(receivedDate.getFullYear()).toString(), month: +(receivedDate.getMonth() + 1).toString(), day: +(receivedDate.getDate()).toString() } };
  }



}







