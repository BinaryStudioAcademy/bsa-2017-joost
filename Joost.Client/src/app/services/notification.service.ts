import {Component, ViewContainerRef} from '@angular/core';
import {ToastsManager, Toast} from 'ng2-toastr';

export class NotificationService {

  private audio;

  constructor(private toastr: ToastsManager, vRef: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vRef);
    this.audio = new Audio();
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
      "<span style=\"font-weight:bold; font-size:14pt; margin-left: 10px;\">"+notificationTitle+"</span>"+
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
      "<span style=\"font-weight:bold; font-size:14pt; margin-left: 10px;\">"+notificationTitle+"</span>"+
    "</div>"+
    "<div>Invites you to "+notificationMessage +"</div>";

    this.toastr.custom(htmlmessage, null,
                       {
                         enableHTML: true
                        });
  }

  showNewMessage(notificationTitle:string, notificationMessage:string) {
    this.playNotificationSound();    
    let htmlmessage: string = 
    "<div>"+
      "<img src=\"assets/notifications/message.png\""+
      "style=\"width:30px; height:30px;\"></img>"+
      "<span style=\"font-weight:bold; font-size:14pt; margin-left: 10px;\">"+notificationTitle+"</span>"+
    "</div>"+
    "<div>"+notificationMessage +"</div>";

    this.toastr.custom(htmlmessage, null,
                       {
                         enableHTML: true
                        });
  }

  showNewMessageInChat(notificationTitle:string, notificationMessage:string) {
    this.playNotificationSound();    
    let htmlmessage: string = 
    "<div>"+
      "<img src=\"assets/notifications/message_in_chat.png\""+
      "style=\"width:30px; height:30px;\"></img>"+
      "<span style=\"font-weight:bold; font-size:14pt; margin-left: 10px;\">"+notificationTitle+"</span>"+
    "</div>"+
    "<div>"+notificationMessage +"</div>";

    this.toastr.custom(htmlmessage, null,
                       {
                         enableHTML: true
                        });
  }

  
}
