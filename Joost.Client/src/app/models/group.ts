import { UserContact } from "./user-contact";

export class Group {
    Id: number = 0;
    Name: string = "";
    Description: string = "";
    SelectedMembersId: Array<number> = [];
}