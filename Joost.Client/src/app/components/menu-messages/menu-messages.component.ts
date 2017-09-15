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

  private senderSubscription: Subscription;
  private receiverSubscription: Subscription;
  private addingGroupsSubscription: Subscription;
  private newGroupSubscription: Subscription;
  private newContactSubscription: Subscription;
  private removeNewContactSubscription: Subscription;

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
          this.updateLastMessage(message);
      });
      this.senderSubscription = this.eventEmitterService.addMessageEvent.subscribe(message => {
        this.updateLastMessage(message);        
      });

      this.addingGroupsSubscription = this.groupServive.addGroupEvent.subscribe(group => {
        this.updateDialogs();
      });

      this.newGroupSubscription = this.chatHubService.onNewGroupCreatedEvent.subscribe((data: any) => {
        this.dialogs.push(data.dialog);
      });

      this.newContactSubscription = this.chatHubService.onAddContactEvent.subscribe((userContact: UserContact) => {
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
  }

  ngOnDestroy() {
      this.senderSubscription.unsubscribe();
      this.receiverSubscription.unsubscribe();
      this.addingGroupsSubscription.unsubscribe();
      this.newContactSubscription.unsubscribe();
      this.newGroupSubscription.unsubscribe();
      this.removeNewContactSubscription.unsubscribe();
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

  onResize($event) {
      console.log($event);
  }

  private updateDialogs() {
    this.dialogService.getDialogs().subscribe(d => {
      var sortArray = this.OrderByArray(d, "DateLastMessage").map(item => item);
      this.UpdateFirstDlgMessages(sortArray);
      this.dialogs = sortArray;
      this.filteredDialogs = sortArray;
    },
    async err => {
      await this.dialogService.handleTokenErrorIfExist(err).then(ok => { 
        if (ok) {
          this.dialogService.getDialogs().subscribe(d => {
            var sortArray = this.OrderByArray(d, "DateLastMessage").map(item => item);
            this.UpdateFirstDlgMessages(sortArray);
            this.dialogs = d;
            this.filteredDialogs = d;
          }); 
        }
      });
    });
    this.contactService.getAllContacts().subscribe(data => {
        for (let item of data) {
            if (item.State == ContactState.New) {
                this.contacts.push(item);
            }
        }
    });
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
        filteredDialogs[0].DateLastMessage = message.CreatedAt;
        this.filteredDialogs = this.OrderByArray(this.filteredDialogs, "DateLastMessage").map(item => item);
    }
  }

  private updateLastGroupMessage(message: Message) {
    let filteredDialogs = this.dialogs.filter(d => d.Id == message.ReceiverId && d.IsGroup);
    if (filteredDialogs.length > 0) {
        filteredDialogs[0].LastMessage = this.GetFristMуssageLine(message.Text);
        filteredDialogs[0].DateLastMessage = message.CreatedAt;
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
