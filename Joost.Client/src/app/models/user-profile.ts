import { Gender } from "./../models/user-detail";
import { UserState } from "./../models/user-detail";

export class UserProfile {
    Id: number;
    Email: string;
    Password: string;
    FirstName: string;
    LastName: string;
    City: string;
    Country: string;
    BirthDate: Date;
    Gender: Gender;
    Status: string;
    Avatar: string;
    State: UserState;
}
