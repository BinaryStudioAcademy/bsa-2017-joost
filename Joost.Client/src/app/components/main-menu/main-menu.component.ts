import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AccountService } from "../../services/account.service";

import { MDL } from "../mdl-base.component";
import { UserProfile } from "../../models/user-profile";
import { ChatHubService } from "../../services/chat-hub.service";
import { Message } from "../../models/message";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent extends MDL implements OnInit {

  private editMode: boolean = false;
  private previousStatus: string;

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
    this.accountService.getUser().subscribe(data => {
      this.curUser = data;
      this.chatHubService.connect(data.Id);
      this.chatHubService.addMessageEvent.subscribe((message: Message) => {
        this.showNotifications(message);
      });
    },
    async error => {
      await this.accountService.handleTokenErrorIfExist(error).then( ok => {
        if(ok) {
          this.accountService.getUser().subscribe(data => {
            this.curUser = data;
            this.chatHubService.connect(data.Id);   
            this.chatHubService.addMessageEvent.subscribe(message => {
              this.showNotifications(message);             
            });   
          });
        }
      })
    });
  }

  onCreateGroup(){
    this.router.navigate(["groups/new"], { relativeTo: this.route });
  }

  private showNotifications(message: Message) {
    if (message.IsGroup) {
      this.notificationService.showNewMessageInChat("Title", message.Text);
    }
    else {
      this.notificationService.showNewMessage("Title", message.Text);
    }
  }
}
