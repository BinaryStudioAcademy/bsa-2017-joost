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

  getUserMessages(userId: string, count: number): Observable<Message[]> {
    let req = new HttpRequest("GET", this.generateUrl() +  "/user-messages", { 
    	params: new HttpParams()
    		.set("userId", userId)
    		.append("count", count.toString())
    });
    return this.http.sendRequest<Message[]>(req);
  }

  getGroupMessages(groupId: string, count: number): Observable<Message[]> {
    let req = new HttpRequest("GET", this.generateUrl() +  "/group-messages", { 
    	params: new HttpParams()
    		.set("groupId", groupId)
    		.append("count", count.toString())
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

  sendUserMessage(senderId: number, receiverId: number, text: string) {
    let message =  this.createMessage(senderId, receiverId, text);
    let req = new HttpRequest("POST", this.generateUrl() + "/user-messages", message);
    return this.http.sendRequest(req);
  }

  sendGroupMessage(senderId: number, receiverId: number, text: string) {
    let message =  this.createMessage(senderId, receiverId, text);    
    let req = new HttpRequest("POST", this.generateUrl() + "/group-messages", message);    
    return this.http.sendRequest(req);
  }

  editUserMessage(messageId: string, text: string): Observable<Message> {
    let req = new HttpRequest("PUT", this.generateUrl() +  "/user-messages", { 
    	params: new HttpParams()
    		.set("messageId", messageId)
        .append("editedTime", new Date().toDateString()),
      body: text
    });
    return this.http.sendRequest<Message>(req);
  }

  editGroupMessage(groupMessageId: string, text: string): Observable<Message> {
    let req = new HttpRequest("PUT", this.generateUrl() +  "/group-messages", { 
    	params: new HttpParams()
    		.set("groupMessageId", groupMessageId)
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
