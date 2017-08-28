import {Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from "../../services/message.service";
import { Message } from "../../models/message";
import { AccountService } from "../../services/account.service";
import { UserService } from "../../services/user.service";
import { GroupService } from "../../services/group.service";
import { MDL } from "../mdl-base.component";
import { DialogService } from "../../services/dialog.service";
import { ChatHubService } from "../../services/chat-hub.service";
import { Subscription } from "rxjs/Rx";


@Component({
    selector: "messages-list",
    templateUrl: "./messages-list.component.html",
    styleUrls: ["./messages-list.component.scss"] 
})
export class MessagesListComponent extends MDL implements OnInit, AfterViewInit {
    private id: number;
    private isGroup: boolean;
    private skip = 0;
    private messages: Message[];
    private currnetUserId: number;
    private dialogName: string;
    private messageText: string;
    private subscription: Subscription;

    constructor(private router: ActivatedRoute,
                private messagesService: MessageService,
                private userService: UserService,
                private accountService: AccountService,
                private groupService: GroupService,
                private dialogService: DialogService,
                private chatHubService: ChatHubService) {

        super();
        this.subscription = this.chatHubService.addMessageEvent.subscribe(() => {
            console.log("inSubscribeConstructor");
            this.addToMessages(new Message());
        });
    }

    private scrolEvent(event) {
        if (event.target.scrollTop === event.target.scrollHeight - 640) {
             if (this.isGroup) {
                this.messagesService.getGroupMessages(this.id, 0, 20)
                    .subscribe(m => {
                        this.messages = this.messages.concat(m.map(me => {
                            return me;
                        }));
                        this.skip += 20;
                    });
            } else {
                this.messagesService.getUserMessages(this.id, 0, 20)
                    .subscribe(m => {
                        this.messages = this.messages.concat(m.map(me => {

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
     this.router.paramMap
        .subscribe((params: ParamMap) => {
            this.skip = 0;
            this.id = +params.get("id");
            this.isGroup = params.get("type") === "group" ? true : false;
            if (this.isGroup) {
                this.groupService.getGroup(+this.id).subscribe(g => {
                this.dialogName = g.Name;
                this.messagesService.getGroupMessages(this.id, 0, 20)
                    .subscribe(m => {
                        this.messages = m.map(me => {
                            return me;
                        });
                        this.skip += 20;
                        console.log(this.messages)
                    });
                });
            } else {
                this.userService.getUserDetails(+this.id).subscribe(user => {
                this.dialogName = user.FirstName + " " + user.LastName;
                this.messagesService.getUserMessages(this.id, 0, 20)
                    .subscribe(m => {
                        this.messages = m.map(me => {
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

    send(text: string) {
        if (text != null && text != "")
        {
            let newMessage = this.messagesService.createMessage(this.currnetUserId, this.id, text);
            this.addToMessages(newMessage);
            this.messagesService.sendUserMessage(newMessage).subscribe(data => { },
            async err => {
                await this.dialogService.handleTokenErrorIfExist(err).then(ok => { 
                    if (ok) {
                        this.messagesService.sendUserMessage(newMessage).subscribe();
                    }
                });
            });
        }
    }

    private addToMessages(message: Message) {
        this.messages.push(message);
        this.messageText = "";
        console.log("inAddToMessagesFunction");
        debugger;
    }
}