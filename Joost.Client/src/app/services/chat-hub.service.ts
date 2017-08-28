import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'signalr';
import { Message } from "../models/message";
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
  public addMessageEvent: EventEmitter<void>;
  //public onUserDisconnectedEvent: EventEmitter<void>;

  constructor() {
    this.SignalrConnection = $.hubConnection(this.url, {
      useDefaultPath: false
    });

    this.ChatProxy = this.SignalrConnection.createHubProxy(this.hubName);

    this.registerEvents();
    this.startConnection();

    this.addMessageEvent = new EventEmitter<void>();
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

    this.ChatProxy.on('addMessage', function () {
      console.log("before");
      self.addMessageEvent.emit();
      console.log("after");      
    });

    this.ChatProxy.on('onUserDisconnected', function (connectionId: string, userId: number) {
    });
  }

  //Server methods here:
  connect(userId: number) {
    this.ChatProxy.invoke('Connect', userId).done(function () {
      console.log('Invocation of Connect on server succeeded.');
    }).fail(function (error) {
      console.log('Invocation of Connect on server failed. Error: ' + error);
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