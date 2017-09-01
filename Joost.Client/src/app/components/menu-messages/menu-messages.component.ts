import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Dialog } from "../../models/dialog";
import { DialogService } from "../../services/dialog.service";
import { ChatHubService } from "../../services/chat-hub.service";
import { Subscription } from "rxjs/Rx";
import { Message } from "../../models/message";
import { MenuMessagesService } from "../../services/menu-messages.service";
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-menu-messages',
  templateUrl: './menu-messages.component.html',
  styleUrls: ['./menu-messages.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuMessagesComponent implements OnInit, OnDestroy {

  private dialogs: Dialog[];
  private filteredDialogs: Dialog[];
  private subscription: Subscription;
  private subscriptionMenu: Subscription;
  private searchString: string;

  constructor(private dialogService: DialogService, private router: Router, private chatHubService: ChatHubService, private menuMessagesService: MenuMessagesService) {
      dialogService.getDialogs().subscribe(d => {
          var sortArray = this.OrderByArray(d, "DateLastMessage").map(item => item);
          this.dialogs = sortArray;
          this.filteredDialogs = sortArray;
        },
        async err => {
          await this.dialogService.handleTokenErrorIfExist(err).then(ok => { 
            if (ok) {
              dialogService.getDialogs().subscribe(d => {
                this.dialogs = d;
                this.filteredDialogs = d;
              }); 
            }
        });
    });
  }

  ngOnInit() {
      this.subscription = this.chatHubService.addMessageEvent.subscribe(message => {
          this.updateLastMessage(message);
      });
      this.subscriptionMenu = this.menuMessagesService.addMessageEvent.subscribe(message => {
          this.updateLastMessage(message);
      });
  }

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  private updateLastMessage(message: Message) {
      let filteredDialogs = this.dialogs.filter(d => d.Id == message.ReceiverId || d.Id == message.SenderId);
      if (filteredDialogs.length > 0) {
          filteredDialogs[0].LastMessage = message.Text;
          filteredDialogs[0].DateLastMessage = message.CreatedAt;
          let data = this.filteredDialogs.filter(d => d.Id != filteredDialogs[0].Id);
          data.push(filteredDialogs[0]);
          this.filteredDialogs = this.OrderByArray(data, "DateLastMessage").map(item => item);;
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
}
