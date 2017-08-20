import {Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessagesService } from "../../services/messages.service";
import { Message } from "../../models/message";
import { UserService } from "../../services/user.service";
import { GroupService } from "../../services/group.service";


@Component({
    selector: "messages-list",
    templateUrl: "./messages-list.component.html",
    styleUrls: ["./messages-list.component.css"] 
})
export class MessagesListComponent implements OnInit, AfterViewInit {
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
                private groupService: GroupService) {
    }

    private isOwnMessage(message) {
        console.log(message, this.currnetUserId);
        return message.SenderId === this.currnetUserId;
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
                            me.Own = me.SenderId === this.currnetUserId.toString();
                            return me;
                        }));
                        this.skip += 20;
                    });
            } else {
                this.messagesService.getUsersMessages(this.id, 20, this.skip)
                    .subscribe(m => {
                        this.messages = this.messages.concat(m.map(me => {
                            me.Own = me.SenderId === this.currnetUserId.toString();
                            return me;
                        }));
                        console.log(m);
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
    this.userService.getUser().subscribe(u => {
    this.currnetUserId = u.Id;
    this.route.paramMap
        .subscribe((params: ParamMap) => {
            this.id = params.get("id");
            this.isGroup = params.get("type") === "group" ? true : false;
            if (this.isGroup) {
                this.groupService.getGroup(+this.id).subscribe(g => {
                this.dialogName = g.Name;
                this.messagesService.getGroupMessages(this.id, 20, this.skip)
                    .subscribe(m => {
                        this.messages = m.map(me => {
                            me.Own = me.SenderId === this.currnetUserId.toString();
                            return me;
                        });
                        this.skip += 20;
                    });
                });
            } else {
                this.userService.getUserDetails(+this.id).subscribe(user => {
                this.dialogName = user.FirstName + " " + user.LastName;
                this.messagesService.getUsersMessages(this.id, 20, this.skip)
                    .subscribe(m => {
                        this.messages = m.map(me => {
                            me.Own = me.SenderId === this.currnetUserId.toString();
                            return me;
                        });
                        this.skip += 20;
                    });
                })
            }
        });
    });
    }
}