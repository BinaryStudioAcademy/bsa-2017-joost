import { Injectable, EventEmitter } from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'signalr';
declare var jquery:any;
declare var $ :any;

export class User {  //temporary here
    public Id: number;
    public ConnectionId : string;

    constructor(id: number, connectionId: string) {
      this.Id = id;
      this.ConnectionId = connectionId;
    }
    
}

export class Message { //temporaty here
    public SenderId: number;      
    public Text: string;    

    constructor(senderId: number, text: string) {
      this.SenderId = senderId;
      this.Text = text;
    }
    
}

@Injectable()
export class ChatHubService {

  private url = 'http://localhost:51248/signalr';
  private hubName = 'chathub';
  private SignalrConnection: any;
  private ChatProxy: any;
  private ConnectionId: any;

  
  private allMessages: Message[];
  private allUsers: User[];
  
  
  constructor() {
    
    this.SignalrConnection = $.hubConnection(this.url, {  
      useDefaultPath: false  
    });
    
    this.ChatProxy = this.SignalrConnection.createHubProxy(this.hubName);

    this.registerEvents();
    this.startConnection();
  
  }
  
  private startConnection(): void {
    this.SignalrConnection.start().done((data: any) => {
      this.ConnectionId = this.SignalrConnection.id;
      console.log('Connection estabilished. Id: ' + this.ConnectionId);
    }).fail((error) => {
      console.log('Could not connect to hub. Error: ' + error);
    });
  }
  
  private registerEvents(): void {
    let self = this;
    
    this.ChatProxy.on('addMessage',function (SenderId: number, message: string) {
      self.addMessage(SenderId,message);
    });  

    this.ChatProxy.on('onConnected',function (ConnectionId: string, userId: number) {   
      self.addUser(ConnectionId,userId);;
    });  

    this.ChatProxy.on('onNewUserConnected',function (ConnectionId: string, userId: number) {     
      self.addUser(ConnectionId, userId);
    });  

    this.ChatProxy.on('onUserDisconnected',function (ConnectionId: string, userId: number) {    
      let index = self.allUsers.map(function(x) {return x.Id; }).indexOf(userId);
      if (index != -1) {
        return self.allUsers.splice(index, 1);
      };
    });  
  
  }
  
  addMessage(SenderId: number, message: string): void {
    this.allMessages.push(new Message(SenderId, message));
  }
  
  addUser(connectionId: string, userId: number): void {
    if (this.ConnectionId !== connectionId) {
      let usr = { Id: userId, ConnectionId: connectionId };
      this.allUsers.push(usr);
    }
  }
  
  //Server methods here:
   SendToUser(SenderId: number, ReceiverId: number, message: string) {  
     this.ChatProxy.invoke('SendToUser', SenderId, ReceiverId, message).done(function () {
       console.log ('Invocation of SendToUser on server succeeded.');
      }).fail(function (error) {
        console.log('Invocation of SendToUser on server failed. Error: ' + error);
      });
   }
    
   SendToGroup(SenderId: number, GroupId: number, message: string) {  
     this.ChatProxy.invoke('SendToGroup', SenderId, GroupId, message).done(function () {
       console.log ('Invocation of SendToGroup on server succeeded.');
      }).fail(function (error) {
        console.log('Invocation of SendToGroup on server failed. Error: ' + error);
      });
   }


}