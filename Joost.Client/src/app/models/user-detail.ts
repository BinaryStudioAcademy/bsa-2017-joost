export class UserDetail{
    Id: number;
    FirstName: string;
    LastName: string;
    City: string;
    Country: string;
    BirthDate: Date;
    Gender: Gender;
    Status: UserState;
    Avatar: string;
    State: number;
}

enum UserState
{
    Online,
    Busy,
    Inaccesible,
    Offline
}

enum Gender
{
    Male,
    Female
}