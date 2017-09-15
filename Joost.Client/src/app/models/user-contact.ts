import {ContactState} from "./contact";
import {UserState} from "./user-detail";

export class UserContact{
    public Id: number;
    public Name: string;
    public City: string;
    public Avatar: string;
    public State: ContactState;
    public UserState: UserState;
    public IsOnline:boolean;
}