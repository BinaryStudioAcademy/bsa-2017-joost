import { UserContact } from "./user-contact";

export class Group {
    Id: number = 0;
    Name: string = "";
    Description: string = "";
    Avatar: string;
    SelectedMembersId: Array<number> = [];
}