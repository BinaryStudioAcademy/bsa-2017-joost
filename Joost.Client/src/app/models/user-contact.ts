import {ContactState} from "./contact";

export class UserContact{
	constructor(id:number, name:string, city:string, avatar:string, state:ContactState){
		this.Id =id;
		this.Name = name;
		this.City = city;
		this.Avatar = avatar;
		this.State = state;
	}
    Id: number;
    Name: string;
    City: string;
    Avatar: string;
    State: ContactState;
}