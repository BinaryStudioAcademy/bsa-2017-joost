import { Injectable, EventEmitter } from '@angular/core';
import { Message } from "../models/message";
import { UserProfile } from "../models/user-profile";

@Injectable()
export class EventEmitterService {

    public addMessageEvent: EventEmitter<Message>; 
    public changeProfileDataEvent: EventEmitter<UserProfile>;  
    public changeStatusEvent: EventEmitter<string>;

    constructor() {
        this.addMessageEvent = new EventEmitter<Message>();   
        this.changeProfileDataEvent = new EventEmitter<UserProfile>();
        this.changeStatusEvent = new EventEmitter<string>();
    }      
}