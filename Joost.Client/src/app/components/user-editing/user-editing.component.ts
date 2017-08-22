import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { AvatarService } from "../../services/avatar.service";
import { AvatarPipe} from "../../pipes/avatar.pipe";
import { MDL } from "../mdl-base.component";

@Component({
  selector: 'app-user-editing',
  templateUrl: './user-editing.component.html',
  styleUrls: ['./user-editing.component.scss']
})
export class UserEditingComponent extends MDL implements OnInit {

  user: User;
  userId: number; // initialize from router on init
  private isLoadFinished:boolean = false;
  private isError:boolean = false;
  private passwordDiv: boolean = false;
  private errorPasswordDiv: boolean = false;
  private errorPasswordDivMessage: string;

  private passwordOld: string = "";
  private passwordFirst: string = "";
  private passwordSecond: string = "";

  private inputDay: string = "";
  private inputMonth: string = "";
  private inputYear: string = "";

  constructor(
    private userService: UserService,
    private avatarService: AvatarService,
    public route: ActivatedRoute,
    public router: Router,
    private location: Location
  ) {
    super();
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params.id;
    this.GetUser();
  }

  SaveUser() {
    this.user.BirthDate = new Date(+this.inputYear, +this.inputMonth-1, +this.inputDay +1);
    this.userService.updateUser(this.user);
    this.router.navigate(['menu']);
    location.reload();
  }

  GetUser() {
    this.userService.getUser().subscribe( d => {
      this.user = d;
      this.getUserBirthDate();
      this.isLoadFinished = true;
    },
    async err=> {
      await this.userService.handleTokenErrorIfExist(err).then(ok => { 
        if (ok) {
          this.userService.getUser().subscribe(d => {
            this.user = d;
            this.getUserBirthDate();
            this.isLoadFinished = true;
          },
          err => {
            this.isError = true;
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
          this.userService.updateUser(this.user);
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
    this.avatarService.SetAvatar(target.files[0],this.userId);
    location.reload();
  }

  getUserBirthDate() {
    let date = new Date(this.user.BirthDate);
    this.inputDay =  (date.getDate()).toString();
    this.inputMonth =  (date.getMonth() + 1).toString();
    this.inputYear =  (date.getFullYear()).toString();
  }

}



