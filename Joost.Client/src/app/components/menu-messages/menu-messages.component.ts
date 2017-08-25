import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Dialog } from "../../models/dialog";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: 'app-menu-messages',
  templateUrl: './menu-messages.component.html',
  styleUrls: ['./menu-messages.component.scss']
})
export class MenuMessagesComponent implements OnInit {

  private dialogs: Dialog[];

  constructor(private dialogService: DialogService, private router: Router) {
    dialogService.getDialogs().subscribe(d => {
      this.dialogs = d;
      console.log(d);
    },
    async err => {
      await this.dialogService.handleTokenErrorIfExist(err).then(ok => { 
        if (ok) {
          dialogService.getDialogs().subscribe(d => {
            this.dialogs = d;
          });
        }
      });
    });
  }

  ngOnInit() {
  }

  private navigateToMessages(dialog: Dialog) {
    this.router.navigate(["/menu/messages", dialog.IsGroup ? "group": "user", dialog.Id]);
  }

}
