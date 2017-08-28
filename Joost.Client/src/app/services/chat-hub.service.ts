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
  public addMessageEvent: EventEmitter<Message>;
  //public onUserDisconnectedEvent: EventEmitter<void>;

  constructor() {
    this.SignalrConnection = $.hubConnection(this.url, {
      useDefaultPath: false
    });

    this.ChatProxy = this.SignalrConnection.createHubProxy(this.hubName);

    this.registerEvents();

    this.addMessageEvent = new EventEmitter<Message>();
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

    this.ChatProxy.on('addMessage', function (message: Message) {
      self.addMessageEvent.emit(message); 
    });

    this.ChatProxy.on('onUserDisconnected', function (connectionId: string, userId: number) {
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