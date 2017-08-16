import { UserDetail } from "./user-detail";

export class Group {
    Id: number;
    Name: string;
    Description: string;
    Members: Array<UserDetail>
}