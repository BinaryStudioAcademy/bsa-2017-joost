export class UserDetail{
    id: number;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    birthDate: Date;
    gender: number;
    status: UserState;
    avatar: string;
    state: number;
}

enum UserState
{
    Online,
    Busy,
    Inaccesible,
    Offline
}