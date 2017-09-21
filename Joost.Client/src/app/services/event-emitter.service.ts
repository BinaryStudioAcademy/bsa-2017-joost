import { Injectable, EventEmitter } from '@angular/core';
import { Message } from "../models/message";
import { UserProfile } from "../models/user-profile";
import { UserContact } from "../models/user-contact";

@Injectable()
export class EventEmitterService {

    public addMessageEvent: EventEmitter<Message>; 
    public changeProfileDataEvent: EventEmitter<UserProfile>;  
    public changeStatusEvent: EventEmitter<string>;
    public addNewContact: EventEmitter<UserContact>;
    public confirmContact: EventEmitter<UserContact>;
    public removeNewContact: EventEmitter<UserContact>;
    public removeContact: EventEmitter<number>;

    constructor() {
        this.addMessageEvent = new EventEmitter<Message>();   
        this.changeProfileDataEvent = new EventEmitter<UserProfile>();
        this.changeStatusEvent = new EventEmitter<string>();
        this.addNewContact = new EventEmitter<UserContact>();
        this.confirmContact = new EventEmitter<UserContact>();
        this.removeNewContact = new EventEmitter<UserContact>();
        this.removeContact = new EventEmitter<number>();
    }      
}