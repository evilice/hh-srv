import { UserRole } from "../user.entity";
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: 0 | 1;
    role?: UserRole;
}
export declare class RegistrationResponseDto {
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: 0 | 1;
    role: UserRole;
}
