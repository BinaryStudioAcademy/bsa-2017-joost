import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'signalr';
import { Message } from "../models/message";
import { Dialog } from "../models/dialog";
import { UserContact } from "../models/user-contact";
import { UserDetail } from "../models/user-detail";
import { ContactState } from "../models/contact";
declare var jquery: any;
declare var $: any;

@Injectable()
export class ChatHubService {

  private url = 'http://localhost:51248/signalr';
  private hubName = 'chathub';
  private SignalrConnection: any;
  private ChatProxy: any;
  private ConnectionId: any;

  //public onConnectedEvent: EventEmitter<void>;
  //public onNewUserConnectedEvent: EventEmitter<void>;
  public onAddMessageEvent: EventEmitter<Message>;
  //public onUserDisconnectedEvent: EventEmitter<void>;
  public onAddContactEvent: EventEmitter<UserContact>;
  public onConfirmContactEvent: EventEmitter<UserContact>;
  public onDeclineContactEvent: EventEmitter<UserContact>;
  public onCanceledContactEvent: EventEmitter<UserContact>;  
  public onDeleteContactEvent: EventEmitter<UserContact>;  
  public onNewGroupCreatedEvent: EventEmitter<any>;  

  constructor() {
    this.SignalrConnection = $.hubConnection(this.url, {
      useDefaultPath: false
    });

    this.ChatProxy = this.SignalrConnection.createHubProxy(this.hubName);

    this.registerEvents();

    this.onAddMessageEvent = new EventEmitter<Message>();
    this.onAddContactEvent = new EventEmitter<UserContact>();
    this.onConfirmContactEvent = new EventEmitter<UserContact>();
    this.onDeclineContactEvent = new EventEmitter<UserContact>();
    this.onCanceledContactEvent = new EventEmitter<UserContact>();    
    this.onDeleteContactEvent = new EventEmitter<UserContact>();    
    this.onNewGroupCreatedEvent = new EventEmitter<any>();        
  }

  private async startConnection(): Promise<any> {
    await this.SignalrConnection.start().done((data: any) => {
      this.ConnectionId = this.SignalrConnection.id;
      console.log('Connection estabilished. Connection id: ' + this.ConnectionId);
    }).fail((error) => {
      console.log('Could not connect to hub. Error: ' + error);
    });
  }

  disconnect() {
    this.SignalrConnection.stop();
  }

  private registerEvents(): void {
    let self = this;

    this.ChatProxy.on('onConnected', function (connectionId: string, userId: number) {
    });

    this.ChatProxy.on('onNewUserConnected', function (connectionId: string, userId: number) {
    });

    this.ChatProxy.on('onAddMessage', function (message: Message) {
      self.onAddMessageEvent.emit(message); 
    });

    this.ChatProxy.on('onUserDisconnected', function (connectionId: string, userId: number) {
    });

    this.ChatProxy.on('onContactAction', function (contact: UserContact) {
      switch (contact.State) {
        case ContactState.New : self.onAddContactEvent.emit(contact); break;
        case ContactState.Accept: self.onConfirmContactEvent.emit(contact); break;
        case ContactState.Decline: self.onDeclineContactEvent.emit(contact); break;
        case ContactState.Canceled: self.onCanceledContactEvent.emit(contact); break;        
        case ContactState.Sent: self.onDeleteContactEvent.emit(contact); break;
        default: break; 
      }
    });

    this.ChatProxy.on('onNewGroupCreated', function (dialog: Dialog, user: UserDetail) {
      self.onNewGroupCreatedEvent.emit({dialog, user});   
    });
  }

  //Server methods here:
  async connect(userId: number) {
    this.startConnection().then(() => {
      this.ChatProxy.invoke('Connect', userId).done(function () {
        console.log('Invocation of Connect on server succeeded.');
      }).fail(function (error) {
        console.log('Invocation of Connect on server failed. Error: ' + error);
      });
    });
  }

  sendToUser(message: Message) {
    this.ChatProxy.invoke('SendToUser', message).done(function () {
      console.log('Invocation of SendToUser on server succeeded.');
    }).fail(function (error) {
      console.log('Invocation of SendToUser on server failed. Error: ' + error);
    });
  }

  sendToGroup(message: Message) {
    this.ChatProxy.invoke('SendToGroup', message).done(function () {
      console.log('Invocation of SendToGroup on server succeeded.');
    }).fail(function (error) {
      console.log('Invocation of SendToGroup on server failed. Error: ' + error);
    });
  }

}