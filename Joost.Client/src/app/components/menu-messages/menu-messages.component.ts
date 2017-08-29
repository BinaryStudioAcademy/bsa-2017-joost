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
  private filteredDialogs: Dialog[];
  private searchString: string;

  constructor(private dialogService: DialogService, private router: Router) {
    dialogService.getDialogs().subscribe(d => {
      this.dialogs = d;
      this.filteredDialogs = d;
      console.log(d);
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
  }

  private navigateToMessages(dialog: Dialog) {
    this.router.navigate(["/menu/messages", dialog.IsGroup ? "group": "user", dialog.Id]);
  }

  private search() {
    let lowerStr  = this.searchString.toLocaleLowerCase();
    this.filteredDialogs = this.dialogs.filter(d => d.Name.toLocaleLowerCase().includes(lowerStr));
  }

}
