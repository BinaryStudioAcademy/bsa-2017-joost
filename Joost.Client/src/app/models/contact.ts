export class Contact{
    constructor(id:number, state:ContactState){
        this.ContactId = id;
        this.State = state;
    }
    ContactId:number;
    State: ContactState;
}

export enum ContactState
{
    New ,
    Sent,
    Accept,
    Decline,
    Canceled
}