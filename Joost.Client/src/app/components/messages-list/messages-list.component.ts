import {Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessagesService } from "../../services/messages.service";
import { Message } from "../../models/message";
import { AccountService } from "../../services/account.service";
import { UserService } from "../../services/user.service";
import { GroupService } from "../../services/group.service";
import { MDL } from "../mdl-base.component";


@Component({
    selector: "messages-list",
    templateUrl: "./messages-list.component.html",
    styleUrls: ["./messages-list.component.css"] 
})
export class MessagesListComponent extends MDL implements OnInit, AfterViewInit {
    private id: string;
    private isGroup: boolean;
    private skip = 0;
    private messages: Message[];
    private currnetUserId: number;
    private dialogName: string;

    constructor(private route: ActivatedRoute,
                private router: ActivatedRoute,
                private messagesService: MessagesService,
                private userService: UserService,
                private accountService: AccountService,
                private groupService: GroupService) {
        super();
    }

    private isOwnMessage(message) {
        return message.SenderId == this.currnetUserId;
    }

    private getDate(date) {
        return new Date(date).toDateString();
    }

    private scrolEvent(event) {
        if (event.target.scrollTop === event.target.scrollHeight - 640) {
             if (this.isGroup) {
                this.messagesService.getGroupMessages(this.id, 20, this.skip)
                    .subscribe(m => {
                        this.messages = this.messages.concat(m.map(me => {
                            me.Own = me.SenderId == this.currnetUserId.toString();
                            return me;
                        }));
                        this.skip += 20;
                    });
            } else {
                this.messagesService.getUsersMessages(this.id, 20, this.skip)
                    .subscribe(m => {
                        this.messages = this.messages.concat(m.map(me => {
                            me.Own = me.SenderId == this.currnetUserId.toString();

                            return me;
                        }));
                        this.skip += 20;
                    });
            }
        }
        return true;
    }

    // tslint:disable-next-line:member-ordering
    @ViewChild('scroll')textarea: ElementRef;

     ngAfterViewInit() {
         console.log(this.textarea)
         this.textarea.nativeElement.scrollTop = 1540;
         console.log(this.textarea.nativeElement.scrollHeight)
     }

   ngOnInit() {
    this.accountService.getUser().subscribe(u => {
    this.currnetUserId = u.Id;
    this.route.paramMap
        .subscribe((params: ParamMap) => {
            this.skip = 0;
            this.id = params.get("id");
            this.isGroup = params.get("type") === "group" ? true : false;
            if (this.isGroup) {
                this.groupService.getGroup(+this.id).subscribe(g => {
                this.dialogName = g.Name;
                this.messagesService.getGroupMessages(this.id, 20, this.skip)
                    .subscribe(m => {
                        this.messages = m.map(me => {
                            me.Own = (me.SenderId == this.currnetUserId.toString());
                            return me;
                        });
                        this.skip += 20;
                        console.log(this.messages)
                    });
                });
            } else {
                this.userService.getUserDetails(+this.id).subscribe(user => {
                this.dialogName = user.FirstName + " " + user.LastName;
                this.messagesService.getUsersMessages(this.id, 20, this.skip)
                    .subscribe(m => {
                        this.messages = m.map(me => {
                            me.Own = (me.SenderId == this.currnetUserId.toString());
                            return me;
                        });
                        this.skip += 20;
                        console.log(this.messages)
                    });
                })
            }
        });
    });
    }
}