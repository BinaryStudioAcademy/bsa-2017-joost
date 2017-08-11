import { Injectable } from '@angular/core';
import 'signalr';
declare var jquery:any;
declare var $ :any;

export class User { 
    public Id: number;
    public ConnectionId : string;

    constructor(id: number, connectionId: string) {
      this.Id = id;
      this.ConnectionId = connectionId;
    }
    
}

export class Message {
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

  private ConnectionId: string;

    constructor() {

      console.log("Constructo of hub STARTED")
      
      $.connection.hub.url = "http://localhost:51248/signalr";
      
      this.chat = $.connection.ChatHub; 
      this.server = this.chat.server;
      this.client = this.chat.client;

      console.log("Constructo of hub REGISTER EVENTS")
      this.registerOnServerEvents(); // setting event handlers


      console.log("Constructo of hub START CONNECTION")      
      this.startConnection(); // connectning to Hub
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
      this.allMessages.push(new Message(SenderId, message));
    }


    addUser(connectionId: string, userId: number): void {
        console.log("Adding new user with id:" + userId);
        if (this.ConnectionId !== connectionId) {
            let usr = { Id: userId, ConnectionId: connectionId };
            this.allUsers.push(usr);
        }
    }

    private startConnection(): void {
        let self = this;
        $.connection.hub.start().done((data: any) => {
            console.log('startConnection ' + data);
            console.log('Send  onConnected');
        }).fail((error) => {
            console.log('Could not connect ' + error);

        });
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
