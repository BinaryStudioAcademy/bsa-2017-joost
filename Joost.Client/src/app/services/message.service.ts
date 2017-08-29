import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { HttpService } from '../services/http.service';
import { HttpRequest, HttpParams } from '@angular/common/http';
import { Message } from '../models/message';

@Injectable()
export class MessageService extends BaseApiService {

  constructor(http: HttpService) {
    super(http);
    this.parUrl = "messages";
  }

  getUserMessages(userId: number, skip: number, take: number): Observable<Message[]> {
    let req = new HttpRequest("GET", this.generateUrl() +  "/user-messages", { 
    	params: new HttpParams()
    		.set("userId", userId.toString())
        .append("skip", skip.toString())
    		.append("take", take.toString())        
    });
    return this.http.sendRequest<Message[]>(req);
  }

  getGroupMessages(groupId: number, skip: number, take: number): Observable<Message[]> {
    let req = new HttpRequest("GET", this.generateUrl() +  "/group-messages", { 
    	params: new HttpParams()
    		.set("groupId", groupId.toString())
        .append("skip", skip.toString())
    		.append("take", take.toString())        
    });
    return this.http.sendRequest<Message[]>(req);
  }

  createMessage(senderId: number, receiverId: number, text: string): Message {
    let message = new Message();
    message.SenderId = senderId;
    message.ReceiverId = receiverId;
    message.Text = text;
    message.CreatedAt = new Date();
    return message;
  }

  sendUserMessage(message: Message) {
    let req = new HttpRequest("POST", this.generateUrl() + "/user-messages", message);
    return this.http.sendRequest(req);
  }

  sendGroupMessage(message: Message) {  
    let req = new HttpRequest("POST", this.generateUrl() + "/group-messages", message);    
    return this.http.sendRequest(req);
  }

  editUserMessage(messageId: number, text: string): Observable<Message> {
    let req = new HttpRequest("PUT", this.generateUrl() +  "/user-messages", { 
    	params: new HttpParams()
    		.set("messageId", messageId.toString())
        .append("editedTime", new Date().toDateString()),
      body: text
    });
    return this.http.sendRequest<Message>(req);
  }

  editGroupMessage(groupMessageId: number, text: string): Observable<Message> {
    let req = new HttpRequest("PUT", this.generateUrl() +  "/group-messages", { 
    	params: new HttpParams()
    		.set("groupMessageId", groupMessageId.toString())
        .append("editedTime", new Date().toDateString()),
      body: text
    });
    return this.http.sendRequest<Message>(req);
  } 

  deleteUserMessage(messageId: number) {
    let req = new HttpRequest("DELETE", this.generateUrl() + "/user-messages", {
      params: new HttpParams()
      .set("messageId", messageId.toString())
    });
    return this.http.sendRequest(req);
  }

  deleteGroupMessage(groupMessageId: number) {   
    let req = new HttpRequest("DELETE", this.generateUrl() + "/group-messages", {
      params: new HttpParams()
      .set("groupMessageId", groupMessageId.toString())
    });    
    return this.http.sendRequest(req);
  }

  isOwnMessage(message: Message, userId: number): boolean {
    return message.SenderId == userId;
  }

}