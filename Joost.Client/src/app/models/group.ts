import { UserDetail } from "./user-detail";

export class Group {
    Id: number;
    Name: string;
    Description: string;
    MembersId: Array<number>;
    ContactsId: Array<number>;
}