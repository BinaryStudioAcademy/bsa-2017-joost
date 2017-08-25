import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'signalr';
declare var jquery: any;
declare var $: any;

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

  public onConnectedEvent: EventEmitter<void>;
  public onNewUserConnectedEvent: EventEmitter<void>;
  public addMessageEvent: EventEmitter<void>;
  public onUserDisconnectedEvent: EventEmitter<void>;

  private allMessages: Message[];

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
      console.log('Connection estabilished. Connection id: ' + this.ConnectionId);
    }).fail((error) => {
      console.log('Could not connect to hub. Error: ' + error);
    });
  }

  private registerEvents(): void {
    let self = this;

    this.ChatProxy.on('onConnected', function (connectionId: string, userId: number) {
    });

    this.ChatProxy.on('onNewUserConnected', function (connectionId: string, userId: number) {
    });

    this.ChatProxy.on('addMessage', function (senderId: number, text: string) {
      self.addMessage(senderId, text);
      self.addMessageEvent.emit();
    });

    this.ChatProxy.on('onUserDisconnected', function (ConnectionId: string, userId: number) {
    });
  }

  addMessage(SenderId: number, message: string): void {
    this.allMessages.push(new Message(SenderId, message));
  }

  //Server methods here:

  connect(userId: number) {
    this.ChatProxy.invoke('Connect', userId).done(function () {
      console.log('Invocation of Connect on server succeeded.');
    }).fail(function (error) {
      console.log('Invocation of Connect on server failed. Error: ' + error);
    });
  }

  sendToUser(senderId: number, receiverId: number, text: string) {
    this.ChatProxy.invoke('SendToUser', senderId, receiverId, text).done(function () {
      console.log('Invocation of SendToUser on server succeeded.');
    }).fail(function (error) {
      console.log('Invocation of SendToUser on server failed. Error: ' + error);
    });
  }

  sendToGroup(senderId: number, groupId: number, text: string) {
    this.ChatProxy.invoke('SendToGroup', senderId, groupId, text).done(function () {
      console.log('Invocation of SendToGroup on server succeeded.');
    }).fail(function (error) {
      console.log('Invocation of SendToGroup on server failed. Error: ' + error);
    });
  }

}