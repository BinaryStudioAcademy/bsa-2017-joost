import {Component, Injectable, ViewContainerRef} from '@angular/core';
import {ToastsManager, Toast} from 'ng2-toastr';
import { Router } from '@angular/router';
import { Message } from "../models/message";

@Injectable()
export class NotificationService {

  private audio;
  private vRef: ViewContainerRef;

  constructor(private toastr: ToastsManager, 
              private router: Router) {
    this.audio = new Audio();
  }

  public setViewContainerRef(vRef: ViewContainerRef) {
    this.vRef = vRef;
    this.toastr.setRootViewContainerRef(this.vRef);
  }

  private playNotificationSound() {
    this.audio.src="assets/notifications/notification.mp3";
    this.audio.load();
    this.audio.play();
  }

  showAddUser(notificationTitle:string) {
    this.playNotificationSound();
    let htmlmessage: string = 
    "<div>"+
      "<img src=\"assets/notifications/add_user.png\""+
      "style=\"width:30px; height:30px;\"></img>"+
      "<span style=\"font-weight:bold; font-size:12pt; margin-left: 10px; color: royalblue;\">"+notificationTitle+"</span>"+
    "</div>"+
    "<div>Wants to add you to friendlist</div>";

    this.toastr.custom(htmlmessage, null,
                       {
                         enableHTML: true
                        });
  }
  
  showAddChat(notificationTitle:string, notificationMessage:string) {
    this.playNotificationSound();
    let htmlmessage: string = 
    "<div>"+
      "<img src=\"assets/notifications/new_chat.png\""+
      "style=\"width:30px; height:30px;\"></img>"+
      "<span style=\"font-weight:bold; font-size:12pt; margin-left: 10px; color: royalblue;\">"+notificationTitle+"</span>"+
    "</div>"+
    "<div>Invites you to "+notificationMessage +"</div>";

    this.toastr.custom(htmlmessage, null,
                       {
                         enableHTML: true
                        });
  }

  showNewMessage(message: Message) {
    this.playNotificationSound();
    let htmlmessage: string = 
    "<div>"+
      "<img src=\"assets/notifications/message.png\""+
      "style=\"width:30px; height:30px;\"></img>"+
      "<span style=\"font-weight:bold; font-size:12pt; margin-left: 10px; color: royalblue;\">"+message.Title+"</span>"+
    "</div>"+
    "<div>"+message.Text +"</div>";
    console.log("sending toast");
    this.toastr.custom(htmlmessage, null,
                       {
                         enableHTML: true
                        });
    this.subscribeOnClickToast(message);                        
  }

  showNewMessageInChat(message: Message) {
    this.playNotificationSound();    
    let htmlmessage: string = 
    "<div>"+
      "<img src=\"assets/notifications/message_in_chat.png\""+
      "style=\"width:30px; height:30px;\"></img>"+
      "<span style=\"font-weight:bold; font-size:12pt; margin-left: 10px; color: royalblue;\">"+message.Title+"</span>"+
    "</div>"+
    "<div>"+message.Text +"</div>";
    console.log("sending toast");
    this.toastr.custom(htmlmessage, null,
                       {
                         enableHTML: true
                        });
    this.subscribeOnClickToast(message);
  }

  private subscribeOnClickToast(message: Message) {
    return this.toastr.onClickToast()
      .subscribe(toast => {            
        if (toast.timeoutId) {
          clearTimeout(toast.timeoutId);
          this.toastr.clearAllToasts();   
          this.navigateToMessages(message);
        }      
    });
  }

  private navigateToMessages(message: Message) {
    let type = message.IsGroup ? "group": "user";
    let id = message.IsGroup ? message.ReceiverId: message.SenderId;
    console.log("/menu/messages" + type + id);
    this.router.navigate(["/menu/messages", type, id]);
  }

} 
