import { Injectable, EventEmitter } from '@angular/core';
import { Message } from "../models/message";
import { UserProfile } from "../models/user-profile";
import { UserContact } from "../models/user-contact";

@Injectable()
export class EventEmitterService {

    public addMessageEvent: EventEmitter<Message>; 
    public changeProfileDataEvent: EventEmitter<UserProfile>;  
    public changeStatusEvent: EventEmitter<string>;
    public removeNewContact: EventEmitter<UserContact>;

    constructor() {
        this.addMessageEvent = new EventEmitter<Message>();   
        this.changeProfileDataEvent = new EventEmitter<UserProfile>();
        this.changeStatusEvent = new EventEmitter<string>();
        this.removeNewContact = new EventEmitter<UserContact>();
    }      
}