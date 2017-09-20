import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import { ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { Dialog } from "../../models/dialog";
import { Message } from "../../models/message";
import { DialogService } from "../../services/dialog.service";
import { ChatHubService } from "../../services/chat-hub.service";
import { GroupService } from "../../services/group.service";
import { EventEmitterService } from "../../services/event-emitter.service";
import { UserContact } from "../../models/user-contact";
import { ContactState } from "../../models/contact";
import { UserNetState } from "../../models/user-netstate";
import { UserState } from "../../models/user-detail";
import { ContactService } from "../../services/contact.service";
import { MessagesListComponent } from "../messages-list/messages-list.component";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-menu-messages',
  templateUrl: './menu-messages.component.html',
  styleUrls: ['./menu-messages.component.scss']
})
export class MenuMessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
    
  private dialogs: Dialog[];
  private contacts: UserContact[] = [];
  private filteredDialogs: Dialog[];
  private searchString: string;
  private currentDialogId: number = -1;
  private currentDialogIsGroup: boolean;

  private senderSubscription: Subscription;
  private receiverSubscription: Subscription;
  private addingGroupsSubscription: Subscription;
  private newGroupSubscription: Subscription;
  private newContactSubscription: Subscription;
  private removeNewContactSubscription: Subscription;
  private userOnlineSubscription: Subscription;
  private userOfflineSubscription: Subscription;
  private userChangeStateSubscription: Subscription;

  constructor(
    private router: Router,
    private dialogService: DialogService, 
    private chatHubService: ChatHubService, 
    private contactService: ContactService,
    private groupServive: GroupService,
    private eventEmitterService: EventEmitterService) {
      this.updateDialogs();
  }

  ngOnInit() {
      this.receiverSubscription = this.chatHubService.onAddMessageEvent.subscribe(message => {
          this.updateDialogs();
          this.updateLastMessage(message);
      });
      this.senderSubscription = this.eventEmitterService.addMessageEvent.subscribe(message => {
          this.updateDialogs();
          this.updateLastMessage(message);        
      });

      this.addingGroupsSubscription = this.groupServive.addGroupEvent.subscribe(group => {
        this.updateDialogs();
      });

      this.newGroupSubscription = this.chatHubService.onNewGroupCreatedEvent.subscribe((data: any) => {
        this.dialogs.push(data.dialog);
      });

      this.newContactSubscription = this.chatHubService.onAddContactEvent.subscribe((userContact: UserContact) => {
             if (userContact.IsOnline) {
               userContact.UserState = UserState.Offline;
             }
             if (userContact.State == ContactState.New) {
                 this.contacts.push(userContact);
             }
       });
      this.removeNewContactSubscription = this.eventEmitterService.removeNewContact.subscribe((userContact: UserContact) => {
          for (let i = 0; i < this.contacts.length; i++) {
              if (this.contacts[i].Id == userContact.Id) {
                  this.contacts.splice(i, 1);
              }
          }
      });
      this.userOnlineSubscription = this.chatHubService.onNewUserConnectedEvent.subscribe( (user:UserNetState)=> {
        this.onUserStateChange(user);
      });
      this.userOfflineSubscription = this.chatHubService.onUserDisconnectedEvent.subscribe( (user:UserNetState)=> {
        this.onUserStateChange(user);
      });
      this.userChangeStateSubscription = this.chatHubService.onUserStateChangeEvent.subscribe((user:UserNetState)=> {
        this.onUserStateChange(user);
      });
  }

  ngOnDestroy() {
      // this.senderSubscription.unsubscribe();
      // this.receiverSubscription.unsubscribe();
      // this.addingGroupsSubscription.unsubscribe();
      // this.newContactSubscription.unsubscribe();
      // this.newGroupSubscription.unsubscribe();
      // this.removeNewContactSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if($("#message-panel").length > 0)
    {
        let height = $("#message-panel")[0].offsetHeight;
        if($(".menu-message-form").length > 0){
            $(".menu-message-form")[0].style.maxHeight = height - 10 + 'px';
        }
    }
  }
  private onUserStateChange(user:UserNetState){
    if (this.dialogs) {
       let userFromDialog = this.dialogs.filter(t=>!t.IsGroup && t.Id ==user.Id)[0];
       if (userFromDialog) {
         userFromDialog.UserState = user.IsOnline ? user.State : UserState.Offline;
       }
    }
    if (this.contacts) {
      let userFromNewContact = this.contacts.filter(t=>t.Id == user.Id)[0];
       if (userFromNewContact) {
        userFromNewContact.UserState = user.IsOnline ? user.State : UserState.Offline;
       }
    }
  }
  onResize($event) {
      console.log($event);
  }

  private updateDialogs() {
    this.dialogService.getDialogs().subscribe(d => {
      var sortArray = this.OrderByArray(d, "DateLastMessage").map(item => item);
      this.UpdateFirstDlgMessages(sortArray);
      this.dialogs = sortArray;
      console.log(sortArray);
      for (var i = this.dialogs.length - 1; i >= 0; i--) {
        if (!this.dialogs[i].IsOnline) {
          this.dialogs[i].UserState = UserState.Offline;
        }
      }  
      this.filteredDialogs = this.dialogs;
    },
    async err => {
      await this.dialogService.handleTokenErrorIfExist(err).then(ok => { 
        if (ok) {
          this.dialogService.getDialogs().subscribe(d => {
            var sortArray = this.OrderByArray(d, "DateLastMessage").map(item => item);
            this.UpdateFirstDlgMessages(sortArray);
            this.dialogs = sortArray;
            for (var i = this.dialogs.length - 1; i >= 0; i--) {
              if (!this.dialogs[i].IsOnline) {
                this.dialogs[i].UserState = UserState.Offline;
              }
            }  
            this.filteredDialogs = this.dialogs;
          }); 
        }
      });
    });
    this.contactService.getAllContacts().subscribe(data => {
        this.contacts = data.filter(t=>t.State == ContactState.New);
        for (var i = this.contacts.length - 1; i >= 0; i--) {
          if (!this.contacts[i].IsOnline) {
            this.contacts[i].UserState = UserState.Offline;
          }
        }
    });
  }

  private checkDirectDialogs() {
      if (this.filteredDialogs && this.filteredDialogs.length > 0) {
          return this.filteredDialogs.filter(item => !item.IsGroup).length > 0;
      }
      return false;
  }

  private checkGroupDialogs() {
      if (this.filteredDialogs && this.filteredDialogs.length > 0) {
          return this.filteredDialogs.filter(item => item.IsGroup).length > 0;
      }
      return false;
  }

  private UpdateFirstDlgMessages(dialogs: Dialog[]){
    for(let dialog of dialogs){
        dialog.LastMessage = this.GetFristMуssageLine(dialog.LastMessage);
    }
  }
  
  private GetFristMуssageLine(text: string): string {
    let index = text.search('<'); // костильненько, проте наразі зійде =)
    let msgTxt: string = "";
    if(index != -1) {
        msgTxt = text.substr(0, index);
        if(msgTxt.length == 0)
        msgTxt = "...";
    }
    else {
        msgTxt = text;
    }
    return msgTxt;
  }

  private updateLastUserMessage(message: Message) {
    let filteredDialogs = this.dialogs.filter(d => (d.Id == message.SenderId || d.Id == message.ReceiverId) && !d.IsGroup);
    if (filteredDialogs.length > 0) {
        filteredDialogs[0].LastMessage = this.GetFristMуssageLine(message.Text);
        filteredDialogs[0].DateLastMessage = new Date(new Date(message.CreatedAt).toLocaleString());
        this.filteredDialogs = this.OrderByArray(this.filteredDialogs, "DateLastMessage").map(item => item);
    }
  }

  private updateLastGroupMessage(message: Message) {
    let filteredDialogs = this.dialogs.filter(d => d.Id == message.ReceiverId && d.IsGroup);
    if (filteredDialogs.length > 0) {
        filteredDialogs[0].LastMessage = this.GetFristMуssageLine(message.Text);
        filteredDialogs[0].DateLastMessage = new Date(message.CreatedAt);
        this.filteredDialogs = this.OrderByArray(this.filteredDialogs, "DateLastMessage").map(item => item);
    }
  }

  private updateLastMessage(message: Message) {
    // show only first line
    if (message.IsGroup) {
      this.updateLastGroupMessage(message);
    }
    else {
      this.updateLastUserMessage(message);
    }
  }

  private navigateToMessages(dialog: Dialog) {
    this.currentDialogId = dialog.Id;
    this.currentDialogIsGroup = dialog.IsGroup;
    this.router.navigate(["/menu/messages", dialog.IsGroup ? "group": "user", dialog.Id]);
  }

  private search() {
    let lowerStr  = this.searchString.toLocaleLowerCase();
    this.filteredDialogs = this.dialogs.filter(d => d.Name.toLocaleLowerCase().includes(lowerStr));
  }

  private OrderByArray(values: any[], orderType: any) {
      return values.sort((a, b) => {
          if (a[orderType] < b[orderType]) {
              return 1;
          }

          if (a[orderType] > b[orderType]) {
              return -1;
          }
          return 0
      });
  }

  private goToConfirm(id: number) {
      if (this.isNewContact(id) || this.isDeclineContact(id)) {
          this.contactService.changeContactIdNotify(id);
          this.router.navigate(['menu/add-contact']);
      }
  }

  isNewContact(id: number): boolean {
      return this.contacts.filter(t => t.Id == id)[0].State === ContactState.New;
  }

  isDeclineContact(id: number): boolean {
      return this.contacts.filter(t => t.Id == id)[0].State === ContactState.Decline;
  }
}
