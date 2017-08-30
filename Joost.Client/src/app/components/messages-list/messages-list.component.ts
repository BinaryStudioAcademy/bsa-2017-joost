import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgModule, AfterViewChecked } from '@angular/core';
import { Subscription } from "rxjs/Rx";
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Message } from "../../models/message";
import { MessageService } from "../../services/message.service";
import { ChatHubService } from "../../services/chat-hub.service";

import { UserProfile } from "../../models/user-profile";
import { AccountService } from "../../services/account.service";
import { UserService } from "../../services/user.service";
import { GroupService } from "../../services/group.service";

import { FileService } from '../../services/file.service';

@Component({
    selector: "messages-list",
    templateUrl: "./messages-list.component.html",
    styleUrls: ["./messages-list.component.scss"] 
})
export class MessagesListComponent implements OnInit, OnDestroy, AfterViewChecked {

    private currentUser: UserProfile;
    private receiverId: number;
    private isGroup: boolean;
    private skip: number = 0;
    private take: number = 8;    
    private messages: Message[];
    private dialogName: string;
    private dialogImage: string;
    private messageText: string;
    private subscription: Subscription;
    private attachedImage: HTMLInputElement;

    constructor(private router: ActivatedRoute,
                private messageService: MessageService,
                private chatHubService: ChatHubService,
                private accountService: AccountService,
                private userService: UserService,
                private groupService: GroupService,
                private fileService: FileService,) { }

    ngOnInit() {      
        this.subscription = this.chatHubService.addMessageEvent.subscribe(message => {
            this.addToMessages(message);
        });
        this.accountService.getUser().subscribe(u => {
            this.currentUser = u;
            this.router.paramMap.subscribe((params: ParamMap) => {
                this.isGroup = params.get("type") === "group" ? true : false;
                this.receiverId = +params.get("id");
                this.GetReceiverData();
            });
        },
        async err => {
            await this.accountService.handleTokenErrorIfExist(err).then(ok => { 
                if (ok) {
                    this.accountService.getUser().subscribe(u => {
                        this.currentUser = u;
                        this.router.paramMap.subscribe((params: ParamMap) => {
                            this.isGroup = params.get("type") === "group" ? true : false;
                            this.receiverId = +params.get("id");
                            this.GetReceiverData();
                        });
                    });
                }
            });
        });
    }

    private GetReceiverData() {
        if (this.isGroup) {
            this.getGroupData();
        } 
        else {
            this.getUserData();
        }
    }

    private getGroupData() {
        this.groupService.getGroup(this.receiverId).subscribe(group => {
            this.dialogName = group.Name;                      
            this.getGroupMessages();
        },
        async err => {
            await this.groupService.handleTokenErrorIfExist(err).then(ok => { 
                if (ok) {
                    this.groupService.getGroup(this.receiverId).subscribe(group => {
                        this.dialogName = group.Name;                      
                        this.getGroupMessages();
                    });
                }
            });
        });
    }

    private getGroupMessages() {
        this.messageService.getGroupMessages(this.receiverId, this.skip, this.take)
            .subscribe(m => this.messages = m.map(m => m),
            async err => {
                await this.messageService.handleTokenErrorIfExist(err).then(ok => { 
                    if (ok) {
                        this.messageService.getGroupMessages(this.receiverId, this.skip, this.take)
                        .subscribe(m => this.messages = m.map(m => m));
                    }
                });
            });
    }

    private getUserData() {
        this.userService.getUserDetails(this.receiverId).subscribe(user => {
            this.dialogName = user.FirstName + " " + user.LastName;
            this.dialogImage = user.Avatar;
            this.getUserMessages();
        },
        async err => {
            await this.userService.handleTokenErrorIfExist(err).then(ok => { 
                if (ok) {
                    this.userService.getUserDetails(this.receiverId).subscribe(user => {
                        this.dialogName = user.FirstName + " " + user.LastName;
                        this.dialogImage = user.Avatar;
                        this.getUserMessages();
                    });
                }
            });
        });
    }

    private getUserMessages() {
        this.messageService.getUserMessages(this.currentUser.Id, this.skip, this.take)
            .subscribe(m => this.messages = m.map(m => m),
            async err => {
                await this.messageService.handleTokenErrorIfExist(err).then(ok => { 
                    if (ok) {
                        this.messageService.getUserMessages(this.currentUser.Id, this.skip, this.take)
                        .subscribe(m => this.messages = m.map(m => m));
                    }
                });
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    send(text: string) {
        console.log("sdf");
        if ((text != null && text != "") || this.attachedImage != null) {
           let fileName =  "";
             if (this.attachedImage != null) {
                 fileName = this.currentUser.Id + "_" +   this.receiverId + "_" + Date.now();
                 
                 this.fileService.UploadImage(this.attachedImage.files[0], fileName).subscribe(
                     
                    res => { // if successfully uploaded file to server, then we can seand a message
                         let newMessage = this.messageService.createMessage(this.currentUser.Id, this.receiverId, text, fileName);
                         this.addToMessages(newMessage);
                         this.messageService.sendUserMessage(newMessage).subscribe(data => { },
                            async err => {
                                await this.messageService.handleTokenErrorIfExist(err).then(ok => { 
                                    if (ok) {
                                        this.messageService.sendUserMessage(newMessage).subscribe();
                                    }
                                });
                            });
                            this.attachedImage = null;
                        },
                    
                     error => console.log("Fail when uploading file to server!"));
                    } else {
                         let newMessage = this.messageService.createMessage(this.currentUser.Id, this.receiverId, text, fileName);
                         this.addToMessages(newMessage);
                         this.messageService.sendUserMessage(newMessage).subscribe(data => { },
                            async err => {
                                await this.messageService.handleTokenErrorIfExist(err).then(ok => { 
                                    if (ok) {
                                        this.messageService.sendUserMessage(newMessage).subscribe();
                                    }
                                });
                            });
                    }
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
        return this.messageService.getUserMessages(this.currentUser.Id, this.skip, this.take).subscribe((data: Message[]) => {
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

    AttachImage(e: Event) {
        this.attachedImage = e.target as HTMLInputElement;
    }

    onShowModal(fileName: string): void{
        document.getElementById("modal-img").setAttribute('src', this.fileService.getFullFileUrl(fileName));
        document.getElementById("modal-ref").setAttribute('href', this.fileService.getFullFileUrl(fileName));
        var dialog = document.querySelector('.wrapper-modal');
        dialog.classList.add("show");
    }

    onCloseModal(){
        var dialog = document.querySelector('.wrapper-modal');
        dialog.classList.remove("show");
    }
    /*
    var dialog = document.querySelector('.wrapper-modal');
      document.querySelector('.close, .button-close').addEventListener('click', function() {
        dialog.classList.remove("show");
        self.router.navigate(['login']);
        location.reload();
      });*/
}