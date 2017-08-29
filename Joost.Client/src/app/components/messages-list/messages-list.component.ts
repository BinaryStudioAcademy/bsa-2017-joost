import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgModule, AfterViewChecked } from '@angular/core';
import { Subscription } from "rxjs/Rx";
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Message } from "../../models/message";
import { MessageService } from "../../services/message.service";
import { ChatHubService } from "../../services/chat-hub.service";

import { AccountService } from "../../services/account.service";
import { UserService } from "../../services/user.service";
import { GroupService } from "../../services/group.service";

@Component({
    selector: "messages-list",
    templateUrl: "./messages-list.component.html",
    styleUrls: ["./messages-list.component.scss"] 
})
export class MessagesListComponent implements OnInit, OnDestroy, AfterViewChecked {
    private id: number;
    private currnetUserId: number;
    private isGroup: boolean;
    private skip: number = 0;
    private take: number = 8;    
    private messages: Message[];
    private dialogName: string;
    private messageText: string;
    private subscription: Subscription;

    constructor(private router: ActivatedRoute,
                private messagesService: MessageService,
                private chatHubService: ChatHubService,

                private userService: UserService,
                private accountService: AccountService,
                private groupService: GroupService) { }

    ngOnInit() {      
        this.subscription = this.chatHubService.addMessageEvent.subscribe(message => {
            this.addToMessages(message);
        });
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
                this.messagesService.getGroupMessages(this.id, this.skip, this.take)
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
                this.messagesService.getUserMessages(this.id, 0, this.take)
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    send(text: string) {
        if (text != null && text != "")
        {
            let newMessage = this.messagesService.createMessage(this.currnetUserId, this.id, text);
            this.addToMessages(newMessage);
            this.messagesService.sendUserMessage(newMessage).subscribe(data => { },
            async err => {
                await this.messagesService.handleTokenErrorIfExist(err).then(ok => { 
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
        this.scrollToBottom();
    }

    //scroll logic
    @ViewChild('scroll') private scrollContainer: ElementRef;
    private getMessages: boolean = false;
    private isAllMessagesReceived: boolean = false;

    private addMessagesToList() {      
        this.getMessages = false;
        this.skip += this.take;
        return this.messagesService.getUserMessages(this.currnetUserId, this.skip, this.take).subscribe((data: Message[]) => {
            if (data.length > 0) {
                this.messages = data.concat(this.messages);     
            }
            else {
                this.skip -= this.take;
                this.isAllMessagesReceived = true;
            }
        },
        err => {
            this.skip -= this.take;
            this.isAllMessagesReceived = true;
        });
    }

    private onScroll() {
        let element = this.scrollContainer.nativeElement;
        let inTop = element.scrollTop === 0;    
        if (inTop && !this.getMessages && !this.isAllMessagesReceived) {
            this.getMessages = true;
        }
    }

    private onAddMessages(): void { 
        if (!this.getMessages) {
            return
        }
        try {
            this.addMessagesToList();
        } 
        catch(err) { }
    }

    ngAfterViewChecked() {
        this.onAddMessages();
    }

    private scrollToBottom() {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } 
        catch(err) { }
    }

    private scrollToBottomOnOneStep() {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.clientHeight;
        } 
        catch(err) { }
    }

    show() {
        console.log(this.scrollContainer.nativeElement.scrollHeight);
        console.log(this.scrollContainer.nativeElement.clientHeight);        
        console.log(this.scrollContainer.nativeElement.scrollTop);
    }

}