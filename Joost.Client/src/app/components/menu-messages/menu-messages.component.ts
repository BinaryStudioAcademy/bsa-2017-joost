import { Component, OnInit } from '@angular/core';
import { DialogsService } from "../../services/dialogs.service";
import { Dialog } from "../../models/dialog";
import { Router } from "@angular/router";

@Component({
  selector: 'app-menu-messages',
  templateUrl: './menu-messages.component.html',
  styleUrls: ['./menu-messages.component.scss']
})
export class MenuMessagesComponent implements OnInit {

  private dialogs: Dialog[];

  private navigateToMessages(dialog: Dialog) {
    this.router.navigate(["/menu/messages", dialog.IsGroup ? "group" : "user" , dialog.Id ]);
  }

  constructor(private dialogsService: DialogsService, private router: Router) {
    dialogsService.getAllDialogs().subscribe(d => {
      this.dialogs = d;
    },
    async err => {
      await this.dialogsService.handleTokenErrorIfExist(err).then(ok => { 
        if (ok) {
          dialogsService.getAllDialogs().subscribe(d => {
            this.dialogs = d;
          });
        }
      });
    });
  }

  ngOnInit() {
  }

}
