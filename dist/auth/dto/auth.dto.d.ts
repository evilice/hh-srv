import { UserRole } from '../../user/user.entity';
export declare class SigninDto {
    email: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        email: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        gender: 0 | 1;
        role: UserRole;
    };
}
