export class UserDetail{
    Id: number;
    FirstName: string;
    LastName: string;
    City: string;
    Country: string;
    BirthDate: Date;
    Gender: Gender;
    Status: string;
    Avatar: string;
    State: UserState;
    IsOnline:boolean;
}

export class Login {
    Email: string;
    Password: string;
}

export enum UserState
{
    Online,
    Busy,
    Inaccesible,
    Offline
}

export enum Gender
{
    Male,
    Female
}