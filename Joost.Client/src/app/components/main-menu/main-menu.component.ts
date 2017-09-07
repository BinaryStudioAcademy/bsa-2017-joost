﻿import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { MDL } from "../mdl-base.component";
import { AccountService } from "../../services/account.service";
import { UserProfile } from "../../models/user-profile";
import { Message } from "../../models/message";
import { ChatHubService } from "../../services/chat-hub.service";
import { Dialog } from "../../models/dialog";
import { UserContact } from "../../models/user-contact";
import { NotificationService } from "../../services/notification.service";
import { EventEmitterService } from "../../services/event-emitter.service";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent extends MDL implements OnInit, OnDestroy {

  private curUser: UserProfile;
  private editMode: boolean = false;
  private previousStatus: string;
  
  private messageNotifSubscription: Subscription;
  private contactNotifSubscription: Subscription;
  private groupNotifSubscription: Subscription;  
  private changeProfileDataSubscription: Subscription;
 
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private accountService: AccountService,
    private chatHubService: ChatHubService,
    private notificationService: NotificationService,
    private vRef: ViewContainerRef,
    private eventEmitterService: EventEmitterService) {
      super();
      notificationService.setViewContainerRef(vRef);
  }

  onEditStatus(){
    this.editMode = true;
    this.previousStatus = this.curUser.Status;
  }
  onSaveStatus(){
    this.accountService.updateStatus(this.curUser.Status)
      .subscribe(response => this.editMode = false);
    this.eventEmitterService.changeStatusEvent.emit(this.curUser.Status);
  }
  onCancelEdit(){
    this.editMode = false;
    this.curUser.Status = this.previousStatus;
  }

  ngOnInit() {
    this.accountService.getUser().subscribe(async data => {
      this.curUser = data;
      await this.chatHubService.connect(data.Id);
      this.runNotifications();
    },
    async error => {
      await this.accountService.handleTokenErrorIfExist(error).then( ok => {
        if(ok) {
          this.accountService.getUser().subscribe(async data => {
            this.curUser = data;
            await this.chatHubService.connect(data.Id);
            this.runNotifications();
          });
        }
      })
    });

    this.changeProfileDataSubscription = this.eventEmitterService.changeProfileDataEvent.subscribe(data => {
      this.curUser = data;
    })
  }

  ngOnDestroy() {
    this.stopRuningNotifications();
    this.changeProfileDataSubscription.unsubscribe();
  }

  onCreateGroup(){
    this.router.navigate(["groups/new"], { relativeTo: this.route });
  }

  private runNotifications() {
    this.messageNotifSubscription = this.chatHubService.addMessageEvent.subscribe((message: Message) => {
      this.showMessageNotification(message);
    });
    this.contactNotifSubscription = this.chatHubService.onNewUserInContactsEvent.subscribe((user: UserContact) => {
      this.notificationService.showAddUser(user.Name);
    });
    this.groupNotifSubscription = this.chatHubService.onNewGroupCreatedEvent.subscribe((groupDialog: Dialog) => { 
      this.notificationService.showAddChat(groupDialog.Name, "");      
    });
  }

  private stopRuningNotifications() {
    this.messageNotifSubscription.unsubscribe();
    this.contactNotifSubscription.unsubscribe();
    this.groupNotifSubscription.unsubscribe();
  }

  private showMessageNotification(message: Message) {
    if (message.IsGroup) {
      if (message.SenderId != this.curUser.Id && !this.isOnGroupMessages(message.ReceiverId))
        this.notificationService.showNewMessageInChat(message.Title, message.Text);
    }
    else {
      if (!this.isOnUserMessages(message.SenderId))
      {
        this.notificationService.showNewMessage(message.Title, message.Text);
      }
    }
  }

  private isOnUserMessages(dialogId: number) {
    return window.location.pathname.search("menu/messages/user/" + dialogId) != -1;
  }

  private isOnGroupMessages(dialogId: number) {   
    return window.location.pathname.search("menu/messages/group/" + dialogId) != -1;
  }

}
