import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgModule, AfterViewChecked, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from "rxjs/Rx";
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';

import { Message } from "../../models/message";
import { MessageService } from "../../services/message.service";
import { ChatHubService } from "../../services/chat-hub.service";

import { UserProfile } from "../../models/user-profile";
import { AccountService } from "../../services/account.service";
import { UserService } from "../../services/user.service";
import { GroupService } from "../../services/group.service";
import { UserDetail } from "../../models/user-detail";

import { FileService } from '../../services/file.service';
import { EventEmitterService } from "../../services/event-emitter.service";
import { UserStatePipe } from "../../pipes/user-state.pipe";
import { UserNetState } from "../../models/user-netstate";
import { UserState } from "../../models/user-detail";

declare var jquery: any;
declare var $: any;

@Component({
    selector: "messages-list",
    templateUrl: "./messages-list.component.html",
    styleUrls: ["./messages-list.component.scss"],
})
export class MessagesListComponent implements OnInit, OnDestroy, AfterViewChecked {

    private subscription: Subscription;
    private messageDeleteSubscription: Subscription;    
    private messageEmoji: any;
    private currentUser: UserProfile;
    private receiverId: number;
    private isGroup: boolean;
    private skip: number = 0;
    private readonly take: number = 20;    
    private messages: Message[];
    private dialogName: string;
    private dialogImage: string;
    private messageText: string;
    private attachedFile: HTMLInputElement;
    private attachedFileName: string;
    private groupMembers: UserDetail[];
    private isFocusMessage: number;
    private citation: string;
    private userOnlineSubscription: Subscription;
    private userOfflineSubscription: Subscription;
    private userChangeStateSubscription: Subscription;

    @ViewChild('scroll') private scrollContainer: ElementRef;
    private getMessages: boolean = false;
    private isAllMessagesReceived: boolean = false;
    private toBottom: boolean = false;

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private messageService: MessageService,
                private eventEmitterService: EventEmitterService,
                private chatHubService: ChatHubService,
                private accountService: AccountService,
                private userService: UserService,
                private groupService: GroupService,
                private cdRef: ChangeDetectorRef,
                private fileService: FileService,
                private route: Router) { }

    private clearAllFields() {
        this.currentUser = null;
        this.receiverId = 0;
        this.isGroup = null;
        this.skip = 0;
        this.messages = null;
        this.dialogName = null;
        this.dialogImage = null;
        this.messageText = null;
        this.attachedFile = null;
        this.groupMembers = null;
        this.getMessages = false;
        this.isAllMessagesReceived = false;
        this.toBottom = false;
        this.messageEmoji = null;
    }

    ngOnInit() {
        this.subscription = this.chatHubService.onAddMessageEvent.subscribe(message => {
            this.addToMessages(message);
        });
        this.router.events
        .filter((event) => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .subscribe((event) => {
                this.init();
            });
        this.init();
        console.log("ngOnInit");
    }

    private init() {
        this.clearAllFields();
        this.accountService.getUser().subscribe(u => {
            this.currentUser = u;
            this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
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
                        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
                            this.isGroup = params.get("type") === "group" ? true : false;
                            this.receiverId = +params.get("id");
                            this.GetReceiverData();
                        });
                    });
                }
            });
        }); 
        
        this.messageEmoji = $("#messageText").emojioneArea({
          pickerPosition: "top",
          filtersPosition: "top",
          tones: false,
          autocomplete: true,
          autoHideFilters: true,
          hidePickerOnBlur: true,
          tonesStyle: "bullet",
          placeholder:"Message text..."
        }); 
        if (this.messageEmoji[0]!==undefined) {
           let self = this;
           this.messageEmoji[0].emojioneArea.on("keyup", function(btn, event) {
               if (event.originalEvent.key=="Enter" && event.originalEvent.ctrlKey) {
                   self.send();
               }
            });
        }  
        this.userOnlineSubscription = this.chatHubService.onNewUserConnectedEvent.subscribe( (user:UserNetState)=> {
          this.onUserStateChange(user);
        });
        this.userOfflineSubscription = this.chatHubService.onUserDisconnectedEvent.subscribe( (user:UserNetState)=> {
          this.onUserStateChange(user);
        });
        this.userChangeStateSubscription = this.chatHubService.onUserStateChangeEvent.subscribe((user:UserNetState)=> {
          this.onUserStateChange(user);
        });      
        this.messageDeleteSubscription = this.chatHubService.onDeleteMessageEvent.subscribe((messageId: number)=> {
            let index = this.messages.findIndex( u=> u.Id == messageId);
            this.messages.splice(index, 1);
            this.cdRef.detectChanges();
        });         
    }
    private onUserStateChange(user:UserNetState){
        if (this.groupMembers) {
           let userFromDialog = this.groupMembers.filter(t=>t.Id ==user.Id)[0];
           if (userFromDialog) {
             userFromDialog.State = user.IsOnline ? user.State : UserState.Offline;
           }
           let userF = this.groupMembers.filter(t=>t.Id !=user.Id)[0];
           console.log("after-"+ userF);
        }
      }
    private toggleListMember(event){
        $(".members-toggle").slideToggle(300);
        $(".group-members h3").toggleClass("open");
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
            this.dialogImage = group.Avatar;
            this.getGroupMembers();                      
            this.getGroupMessages();
        },
        async err => {
            await this.groupService.handleTokenErrorIfExist(err).then(ok => { 
                if (ok) {
                    this.groupService.getGroup(this.receiverId).subscribe(group => {
                        this.dialogName = group.Name;       
                        this.dialogImage = group.Avatar;               
                        this.getGroupMessages();
                    });
                }
            });
        });
    }

    private getGroupMessages() {
        console.log("getting group messages");
        this.messageService.getGroupMessages(this.receiverId, this.skip, this.take)
            .subscribe(m => {
                this.messages = m;
                for (var i = this.messages.length - 1; i >= 0; i--) {
                    this.messages[i].CreatedAt = this.convertUTCDateToLocalDate(this.messages[i].CreatedAt);
                    this.messages[i].EditedAt = this.convertUTCDateToLocalDate(this.messages[i].EditedAt);
                }
                this.toBottom = true;                             
            },
            async err => {
                await this.messageService.handleTokenErrorIfExist(err).then(ok => { 
                    if (ok) {
                        this.messageService.getGroupMessages(this.receiverId, this.skip, this.take)
                        .subscribe(m => {
                            this.messages = m;  
                            for (var i = this.messages.length - 1; i >= 0; i--) {
                                this.messages[i].CreatedAt = this.convertUTCDateToLocalDate(this.messages[i].CreatedAt);
                                this.messages[i].EditedAt = this.convertUTCDateToLocalDate(this.messages[i].EditedAt);
                            }
                            this.toBottom = true;                             
                        });
                    }
                });
            });
    }

    private getGroupMembers() {
        this.groupService.getGroupMembers(this.receiverId)
            .subscribe(m => {
                this.groupMembers = m;
                for (var i = this.groupMembers.length - 1; i >= 0; i--) {
                  if (!this.groupMembers[i].IsOnline) {
                    this.groupMembers[i].State = UserState.Offline;
                  }
                }          
            },
            async err => {
                await this.groupService.handleTokenErrorIfExist(err).then(ok => { 
                    if (ok) {
                        this.groupService.getGroupMembers(this.receiverId)
                        .subscribe(m => {
                            this.groupMembers = m;           
                            for (var i = this.groupMembers.length - 1; i >= 0; i--) {
                              if (!this.groupMembers[i].IsOnline) {
                                this.groupMembers[i].State = UserState.Offline;
                              }
                            }  
                        });
                    }
                });
            });
    }

    private getMember(id: number): UserDetail {
        if (this.groupMembers) {
            return this.groupMembers.find(m => m.Id == id);
        }
        
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
        this.messageService.getUserMessages(this.receiverId, this.skip, this.take)
            .subscribe(m => {
                this.messages = m;
                for (var i = this.messages.length - 1; i >= 0; i--) {
                    this.messages[i].CreatedAt = this.convertUTCDateToLocalDate(this.messages[i].CreatedAt);
                    this.messages[i].EditedAt = this.convertUTCDateToLocalDate(this.messages[i].EditedAt);
                }
                this.toBottom = true;           
            },
            async err => {
                await this.messageService.handleTokenErrorIfExist(err).then(ok => { 
                    if (ok) {
                        this.messageService.getUserMessages(this.receiverId, this.skip, this.take)
                        .subscribe(m => {
                            this.messages = m;   
                            for (var i = this.messages.length - 1; i >= 0; i--) {
                                this.messages[i].CreatedAt = this.convertUTCDateToLocalDate(this.messages[i].CreatedAt);
                                this.messages[i].EditedAt = this.convertUTCDateToLocalDate(this.messages[i].EditedAt);
                            }
                            this.toBottom = true;                             
                        })
                    }
                });
            });
    }
    private convertUTCDateToLocalDate(time:Date) {
        let date = new Date(time);
        var newDate = new Date(date.getTime() + date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);

        return newDate;   
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    send(text?: string) {
        //use primary emoji
        // text = this.messageEmoji[0].emojioneArea.getText();
        //user image emoji
        if (this.messageEmoji[0]!==undefined) {
            text = $(".emojionearea-editor").html();
            this.messageEmoji[0].emojioneArea.setText("");
        }
        if ((text != null && text != "") || this.attachedFile != null || this.citation) {
            if (this.citation) {
                text += '<br>' + this.citation;
                this.citation = undefined;
            }
            let fileName =  "";
            if (this.attachedFile != null) {
                fileName = this.currentUser.Id + "_" +  this.receiverId + "_" + Date.now() + '.' + this.fileService.getFileExtensions(this.attachedFile.files[0].name);               
                this.fileService.UploadFile(this.attachedFile.files[0], fileName).subscribe(
                    res => { // if successfully uploaded file to server, then we can send a message
                        this._send(text, fileName);
                        console.log("file was sended");
                    },
                    error => console.log("Fail when uploading file to server!"));
                this.deleteFileFromMsg();
            } 
            else {
                console.log("before sending group message");
                this._send(text, fileName);       
            }
        }
    }

    private IsAttachedFile():boolean {
        return this.attachedFile && this.attachedFile.files.length > 0;
    }

    private IsCanHoverSendButton(): boolean{
        return this.IsAttachedFile() || this.messageEmoji[0]!==undefined && $(".emojionearea-editor").html();
    }

    private _send(text: string, fileName: string) {
        if (this.isGroup) {
            console.log("sending group message");
            this.sendGroupMessage(text, fileName);
        }
        else {
            this.sendUserMessage(text, fileName);
        }
    }

    private sendUserMessage(text: string, fileName: string) {
        let message = this.messageService.createMessage(this.currentUser.Id, this.receiverId, text, fileName, false);
		this.messageService.sendUserMessage(message).subscribe(data => {
			message.Id = data;
			this.addToMessages(message);
			this.messageText = null;
            this.eventEmitterService.addMessageEvent.emit(message); 
        },
            async err => {
                await this.messageService.handleTokenErrorIfExist(err).then(ok => { 
                    if (ok) {
                        this.messageService.sendUserMessage(message).subscribe(data => {
                            message.Id = data;                        
                            this.addToMessages(message);
                            this.messageText = null;
                            this.eventEmitterService.addMessageEvent.emit(message);
                        });
                    }
                });
            });
    }

    private sendGroupMessage(text: string, fileName: string) {
        let message = this.messageService.createMessage(this.currentUser.Id, this.receiverId, text, fileName, true);        
        this.messageService.sendGroupMessage(message).subscribe(data => {
            message.Id = data;
            this.messageText = null; 
            this.eventEmitterService.addMessageEvent.emit(message);             
        },
            async err => {
                await this.messageService.handleTokenErrorIfExist(err).then(ok => { 
                    if (ok) {
                        this.messageService.sendGroupMessage(message).subscribe(data => {
                            message.Id = data;
                            this.messageText = null;
                            this.eventEmitterService.addMessageEvent.emit(message);             
                        });
                    }
                });
            });
    }

    private addToMessages(message: Message) {
        if (this.currentUser.Id == message.SenderId || (this.isGroup == message.IsGroup && 
            ((this.isGroup && this.receiverId == message.ReceiverId) || 
            (!this.isGroup && this.receiverId == message.SenderId)))) {
            this.messages.push(message);
            this.toBottom = true;
            this.cdRef.detectChanges();
        }
    }

    //scroll logic

    private addUserMessagesToList() {     
        this.getMessages = false;
        this.skip += this.take;
        return this.messageService.getUserMessages(this.receiverId, this.skip, this.take).subscribe((data: Message[]) => {
            if (data.length > 0) {          
                this.messages = data.concat(this.messages); 
                this.scrollToBottomOnOneStep(); 
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

    private addGroupMessagesToList() {    
        this.getMessages = false;
        this.skip += this.take;
        return this.messageService.getGroupMessages(this.receiverId, this.skip, this.take).subscribe((data: Message[]) => {
            if (data.length > 0) {          
                this.messages = data.concat(this.messages); 
                this.scrollToBottomOnOneStep(); 
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
        let inTop = element.scrollTop === 0 && element.scrollHeight > 0;    
        if (inTop && !this.getMessages && !this.isAllMessagesReceived) {
            this.getMessages = true;
        }
    }

    private onAddMessages(): void { 
        if (!this.getMessages) {
            return
        }
        try {
            if (this.isGroup) {
                this.addGroupMessagesToList();
            }
            else {
                this.addUserMessagesToList();             
            }
        } 
        catch(err) { }
    }

    private scrollToBottom() {
        try {         
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;  
            this.cdRef.detectChanges();
        } 
        catch(err) { }
    }

    private scrollToBottomOnOneStep() {
        try {
            this.scrollContainer.nativeElement.scrollTop = 1;          
        } 
        catch(err) { }
    }

    private onScrollToBottom() {
        if (!this.toBottom) {
            return
        }
        this.scrollToBottom();
        let sh = this.scrollContainer.nativeElement.scrollHeight;
        let st = this.scrollContainer.nativeElement.scrollTop;
        let ch = this.scrollContainer.nativeElement.clientHeight;
        let step = sh - ch;
        let eps = 1;
        console.log("step - " + step)
        if (sh > 0 && st > 0) {
            this.toBottom = false;
            console.log("exit");
        }
    }

    show() {
        console.log(this.scrollContainer.nativeElement.scrollHeight);
        console.log(this.scrollContainer.nativeElement.clientHeight);        
        console.log(this.scrollContainer.nativeElement.scrollTop);
    }

    ngAfterViewChecked() {
        this.onAddMessages();
        this.onScrollToBottom();      
    }

    private OnChangesFile(): void{
        if(this.attachedFile && this.attachedFile.files.length > 0) {
            this.attachedFileName = this.attachedFile.files[0].name;
            console.log(this.attachedFileName);
        }
    }

    AttachImage(e: Event) {
        this.attachedFile = e.target as HTMLInputElement;
    }

    onShowModal(fileName: string): void{
        document.getElementById("modal-img").setAttribute('src', this.fileService.getFullFileUrlWithOutEx(fileName));
        document.getElementById("modal-ref").setAttribute('href', this.fileService.getFullFileUrlWithOutEx(fileName));
        var dialog = document.querySelector('.wrapper-modal');
        dialog.classList.add("show");
    }

    onCloseModal(){
        var dialog = document.querySelector('.wrapper-modal');
        dialog.classList.remove("show");
    }

    isImage(fileName: string): boolean{
        return this.fileService.isImage(fileName);
    }

    getFileName(fileName: string): string{
        return this.fileService.getFileName(fileName);
    }

    getFileExtension(fileName: string): string {
        return this.fileService.getFileExtensions(fileName);
    }

    getFullFileUrl(fileName: string): string{
        return this.fileService.getFullFileUrlWithOutEx(fileName);
    }

    onDownloadFile(fileName : string){
        this.fileService.download(fileName);
    }

    onNavigateTo():void {
        console.log("onNavigateTo");
        if(this.isGroup)
            this.router.navigate(["menu/groups/details", this.receiverId]);
        else
            this.router.navigate(["menu/user-details", this.receiverId]);  
    }

    private focusMessage(messageId: number) {
        this.isFocusMessage = messageId;
    }

    private focusoutMessage() {
        this.isFocusMessage = 0;
    }

    private isFocus(message: Message) {
        let result = this.isFocusMessage == message.Id && this.currentUser.Id != message.SenderId;
        return result;
    }

    makeCitation(message: Message) {
        this.userService.getUserDetails(message.SenderId).subscribe(data => {
            var content = '<div class="citation-show"><i class="material-icons" style="font-size: 8px">format_quote</i>' + message.Text + '';
            if (message.AttachedFile) {
                if (this.isImage(message.AttachedFile))
                    content += '<img class="img-citation" src="' + this.fileService.getFullFileUrlWithOutEx(message.AttachedFile) + '">';
                else
                    content += '<i class="material-icons">insert_drive_file</i>';
            }
            content += '<i class="material-icons" style="font-size: 8px">format_quote</i><br>';
            var date = new Date(message.CreatedAt);
            if (!message.IsGroup) {
                content += data.FirstName + " " + data.LastName + ', ' + date.toDateString();
            } else {
                let sender = this.getMember(message.SenderId);
                content += sender.LastName + ' ' + sender.FirstName + ', ' + date.toDateString();
            }
            content += '</div>';
            this.citation = content;
        });
    }

    deleteFileFromMsg(): void {
        if(this.attachedFile) {
            this.attachedFile.value = '';
            this.attachedFile = null;
            this.attachedFileName = null;
        }
    }

    deleteCitation(): void {
        this.citation = undefined;
    }

    onGoToUser(Id: number){
        this.router.navigate(["/menu/user-details", Id]);
    }

    deleteMessage(msg: Message) {
        if (!this.isGroup){
            this.messageService.deleteUserMessage(msg.Id).subscribe(() => {
                let index = this.messages.findIndex( u=> u.Id == msg.Id);
                this.messages.splice(index, 1);
                this.cdRef.detectChanges();
                console.log("Message with id: " + msg.Id + " deleted successfully!");
            },
            err => {
                console.log("Error when deleting message with id: " + msg.Id);
                console.log(err);
            });
        } else {
            this.messageService.deleteGroupMessage(msg.Id).subscribe(() => {
                console.log("Group message with id: " + msg.Id + " deleted successfully!");
            },
            err => {
                console.log("Error when deleting gropu message with id: " + msg.Id);
                console.log(err);
            });
        }
    }
}