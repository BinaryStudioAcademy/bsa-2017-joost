import { Component, OnInit, AfterViewInit,AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserProfile } from "../../models/user-profile";
import { UserService } from "../../services/user.service";
import { AccountService } from "../../services/account.service";
import { AvatarService } from "../../services/avatar.service";
import { FileService } from "../../services/file.service";
import { AvatarPipe} from "../../pipes/avatar.pipe";
import { NamePipe } from "../../pipes/name.pipe";
import { MDL } from "../mdl-base.component";

import {IMyDpOptions} from 'mydatepicker';

import { EventEmitterService } from "../../services/event-emitter.service";
import { Subscription } from "rxjs/Rx";
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-user-editing',
  templateUrl: './user-editing.component.html',
  styleUrls: ['./user-editing.component.scss'],
})

export class UserEditingComponent extends MDL implements OnInit, AfterViewChecked {

  user: UserProfile;
  private messageEmoji:any;
  private isLoadFinished:boolean = false;
  private passwordDiv: boolean = false;
  private errorPasswordDiv: boolean = false;
  private errorPasswordDivMessage: string;
  private isEmojiLoad:boolean = false;
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

  private avatarImageSrc: string;
  private avatarImage: HTMLInputElement;

  private changeStatusSubscription: Subscription;

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private avatarService: AvatarService,
    private fileService: FileService,
    public router: Router,
    private location: Location,
    private eventEmitterService: EventEmitterService
  ) {
    super();
  }

  ngOnInit() {
    this.GetUser();
    this.changeStatusSubscription = this.eventEmitterService.changeStatusEvent.subscribe(data => {
      this.user.Status = data;

    }); 
  }
  //Потрібно для заміни звичайного інпута на інпут з емодзі після заванатаження даних
  ngAfterViewChecked(){
    this.addEmoji();
  }

  addEmoji(){
    this.messageEmoji = $("#userStatus").emojioneArea({
      pickerPosition: "bottom",
      filtersPosition: "top",
      tones: false,
      autocomplete: true,
      inline: true,
      autoHideFilters: true,
      hidePickerOnBlur: true,
      placeholder: "Describe your mood..."
    }); 
    if (this.isLoadFinished && this.messageEmoji[0]!==undefined && !this.isEmojiLoad) {
      this.messageEmoji[0].emojioneArea.setText(this.user.Status);
      this.isEmojiLoad = true;
    }
  }
  
  SaveUser() {
    this.user.BirthDate = new Date(this.datePickerValue.date.year, this.datePickerValue.date.month-1, this.datePickerValue.date.day+1);
    if (this.messageEmoji[0]!==undefined) {
       let text = this.messageEmoji[0].emojioneArea.getText();
       this.user.Status = text;
    }
    this.accountService.updateUser(this.user);
    if(this.avatarImage) {
          this.avatarService.SetUserAvatar(this.avatarImage.files[0]).subscribe(
            res => {
              this.user.Avatar = this.user.Id + "_avatar." + this.fileService.getFileExtensions(this.avatarImage.files[0].name);
              this.avatarImageSrc = this.avatarService.getFullUrl(this.user.Id, false) + '?random+\=' + Math.random();
              this.eventEmitterService.changeProfileDataEvent.emit(this.user);
              this.router.navigate(['menu']);
          }, 
            error => console.log("Fail when setting avatar"));
        } else {
          this.eventEmitterService.changeProfileDataEvent.emit(this.user);
          this.router.navigate(['menu']);
        }
  }

  GetUser() {
    this.accountService.getUser().subscribe( d => {
      this.user = d;
      this.getUserBirthDate();
      if (this.user.Avatar)
        this.avatarImageSrc = this.avatarService.getFullUrl(this.user.Id, false) + '?random+\=' + Math.random();
      this.isLoadFinished = true;
    },
    async err=> {
      await this.userService.handleTokenErrorIfExist(err).then(ok => { 
        if (ok) {
          this.accountService.getUser().subscribe(d => {
            this.user = d;
            this.getUserBirthDate();
            if (this.user.Avatar)
              this.avatarImageSrc = this.avatarService.getFullUrl(this.user.Id, false) + '?random+\=' + Math.random();            
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
  
  // CancelPassword() {
  //   this.passwordDiv = !this.passwordDiv;
  //   this.passwordOld = this.passwordFirst = this.passwordSecond ="";
  //   this.errorPasswordDiv = false;
  // }
  
  SendAvatar(e: Event) {
    this.avatarImage = e.target as HTMLInputElement;
  }

  getUserBirthDate() { // convertung date from server to date for datePicker
    let receivedDate = new Date(this.user.BirthDate);
    this.datePickerValue = {  date: { year: +(receivedDate.getFullYear()).toString(), month: +(receivedDate.getMonth() + 1).toString(), day: +(receivedDate.getDate()).toString() } };
  }
}

