import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from "rxjs/Rx";
import { MDL } from "../mdl-base.component";
import { AccountService } from "../../services/account.service";
import { UserProfile } from "../../models/user-profile";
import { Message } from "../../models/message";
import { ChatHubService } from "../../services/chat-hub.service";
import { Dialog } from "../../models/dialog";
import { UserContact } from "../../models/user-contact";
import { UserState } from "../../models/user-detail";
import { NotificationService } from "../../services/notification.service";
import { EventEmitterService } from "../../services/event-emitter.service";
import { AvatarService } from "../../services/avatar.service";
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  host: {
   '(document:click)': 'onClickOutside($event)',
  },
})
export class MainMenuComponent extends MDL implements OnInit, OnDestroy {

  private curUser: UserProfile;
  private editMode: boolean = false;
  private previousStatus: string;
  private avatarImgSrc: string;
  
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
    private avatarService: AvatarService,
    private vRef: ViewContainerRef,
    private eventEmitterService: EventEmitterService) {
      super();
      notificationService.setViewContainerRef(vRef);
  }
  showStateList(){
    $(".state-list").slideToggle(300);
  }
  onClickOutside(event) {
    if (!$(event.target).is('.open-list, .state-list, .state-list *')){
      $(".state-list").slideUp(300);
    }
  }
  changeState(state:UserState){
    if (this.curUser.State!=state) {
      this.curUser.State = state;
      this.accountService.updateUser(this.curUser);
      $(".state-list").slideUp(300);
    }
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
      if (this.curUser.Avatar)
        this.avatarImgSrc = this.avatarService.getFullUrl(this.curUser.Id, false) + '?random+\=' + Math.random();
      await this.chatHubService.connect(data.Id);
      this.runNotifications();
    },
    async error => {
      await this.accountService.handleTokenErrorIfExist(error).then( ok => {
        if(ok) {
          this.accountService.getUser().subscribe(async data => {
            this.curUser = data;
            if (this.curUser.Avatar)
              this.avatarImgSrc = this.avatarService.getFullUrl(this.curUser.Id, false) + '?random+\=' + Math.random();
            await this.chatHubService.connect(data.Id);
            this.runNotifications();
          });
        }
      })
    });

    this.changeProfileDataSubscription = this.eventEmitterService.changeProfileDataEvent.subscribe(data => {
      this.curUser = data;
      this.avatarImgSrc = this.avatarService.getFullUrl(this.curUser.Id, false) + '?random+\=' + Math.random();
    })
  }

  ngOnDestroy() {
    this.stopRuningNotifications();
    this.changeProfileDataSubscription.unsubscribe();
  }

  onCreateGroup(){
      this.router.navigate(["groups/new"], { relativeTo: this.route, skipLocationChange: true });
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
