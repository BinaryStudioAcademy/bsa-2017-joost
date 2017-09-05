import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from "../../services/account.service";

import { MDL } from "../mdl-base.component";
import { UserProfile } from "../../models/user-profile";
import { ChatHubService } from "../../services/chat-hub.service";
import { Message } from "../../models/message";
import { NotificationService } from "../../services/notification.service";
import { Subscription } from "rxjs/Rx";
import { Group } from "../../models/group";
import { UserContact } from "../../models/user-contact";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent extends MDL implements OnInit, OnDestroy {

  private editMode: boolean = false;
  private previousStatus: string;
  private messageNotifSubscription: Subscription;
  private contactNotifSubscription: Subscription;
  private groupNotifSubscription: Subscription;  

  private curUser: UserProfile; 
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private accountService: AccountService,
    private chatHubService: ChatHubService,
    private notificationService: NotificationService,
    private vRef: ViewContainerRef) {
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
  }

  ngOnDestroy() {
    this.stopRuningNotifications();
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
    this.groupNotifSubscription = this.chatHubService.onNewGroupCreatedEvent.subscribe((group: Group) => { 
      this.notificationService.showAddChat(group.Name, group.Description);      
    });
  }

  private stopRuningNotifications() {
    this.messageNotifSubscription.unsubscribe();
    this.contactNotifSubscription.unsubscribe();
    this.groupNotifSubscription.unsubscribe();
  }

  private showMessageNotification(message: Message) {
    if (message.IsGroup) {
      if (message.SenderId != this.curUser.Id)
        this.notificationService.showNewMessageInChat(message.Title, message.Text);
    }
    else {
      this.notificationService.showNewMessage(message.Title, message.Text);
    }
  }

}
