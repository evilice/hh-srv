export declare enum UserRole {
    ADMIN = "admin",
    SEEKER = "seeker",
    EMPLOYER = "employer"
}
export declare class User {
    email: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
    gender: 0 | 1;
    role: UserRole;
    createdAt: Date;
    lastVisit: Date;
}
