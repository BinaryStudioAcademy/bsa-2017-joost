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
  
  private allMessages: Message[];
  private allUsers: User[];
  
  private server: any;
  private client: any;
  private chat: any;

  private SignalrConnection: any;
  private ChatProxy: any;

  private ConnectionId: string;


    constructor() {

      console.log("ChatHub constructor");
      
      
      this.SignalrConnection = $.hubConnection("http://localhost:51248/signalr", {  
        useDefaultPath: false  
      });
      
      this.ChatProxy = this.SignalrConnection.createHubProxy('chathub');
      console.log("Proxy created");

        this.ChatProxy.on("addMessage",function (a, b) {   
            console.log(a + 'ssssssssss' + b);
         });  


      //this.registerOnServerEvents();
      //console.log("Events registered");
      
      this.startConnection();
    }
       
    
    private registerOnServerEvents(): void {
      
      let self = this;
       
      this.client.addMessage = (SenderId: number, message: string) => {
        console.log("Adding message event on client");
        self.addMessage(SenderId, message);
      };

      // User registration event
      this.client.onConnected = (ConnectionId: string, userId: number) => {
        console.log("First user connected! Id:" + userId);        
         self.addUser(ConnectionId,userId);
      };
      
      
      this.client.onNewUserConnected = (ConnectionId: string, userId: number) => {
        console.log("New user connected! Id:" + userId);        
        self.addUser(ConnectionId, userId);
      };
      
      
      this.client.onUserDisconnected = (ConnectionId: string, userId: number) => {
        console.log("User deisconnected. Id:" + userId);        
        let index = self.allUsers.map(function(x) {return x.Id; }).indexOf(userId); // what if dont eist?
        
        if (index != -1) {
          return self.allUsers.splice(index, 1);
        };
      }
    }
    
    // обробка пвд з сервера
    addMessage(SenderId: number, message: string): void {
        console.log("Getting message from server:" + message);      
      //this.allMessages.push(new Message(SenderId, message));
    }


    addUser(connectionId: string, userId: number): void {
        console.log("Adding new user with id:" + userId);
        if (this.ConnectionId !== connectionId) {
            let usr = { Id: userId, ConnectionId: connectionId };
            this.allUsers.push(usr);
        }
    }

    private startConnection(): void {
       this.SignalrConnection.start().done((data: any) => {
            console.log("Connection estabilished");
        }).fail((error) => {
            console.log("Could not connect " + error);

        });
    }


   testInvoking() {  
    this.ChatProxy.invoke('asp').done(function () {
        console.log ('Invocation of NewContosoChatMessage succeeded');
    }).fail(function (error) {
        console.log('Invocation of NewContosoChatMessage failed. Error: ' + error);
    });
    console.log('Invoked');
}  

//--------------------------------------------------------------------------------

    // // серверний метод для надсилання пвд конкретному юзеру
    // sendMessageToUser(SenderId: number, ReceiverId: number, message: string) {
    //     console.log("Sending message" + message + " from user: " + SenderId +  " to user: " + ReceiverId );
      
    //   this.server.SendToUser(SenderId, ReceiverId, message);
    // }

    //   // серверний метод для надсилання пвд групі
    // sendMessageToGroup(SenderId: number, GroupId: number, message: string) {
    //     console.log("Sending message" + message + " from user: " + SenderId +  " to group: " + GroupId );

      
    //   this.server.SendToGroup(SenderId, GroupId, message);
    // }

//--------------------------------------------------------------------------------
    

}