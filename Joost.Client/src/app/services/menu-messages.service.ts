import { Injectable, EventEmitter } from '@angular/core';
import { Message } from "../models/message";

@Injectable()
export class MenuMessagesService {

    public addMessageEvent: EventEmitter<Message>;   

    constructor() {
        this.addMessageEvent = new EventEmitter<Message>();   
    }      
}