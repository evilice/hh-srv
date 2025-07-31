import { AuthService } from './auth.service';
import { SigninDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(signinDto: SigninDto): Promise<AuthResponseDto>;
    signout(req: any): Promise<{
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto>;
    adminOnly(req: any): {
        message: string;
        user: any;
    };
    employerOnly(req: any): {
        message: string;
        user: any;
    };
    seekerOnly(req: any): {
        message: string;
        user: any;
    };
    adminOrEmployer(req: any): {
        message: string;
        user: any;
    };
}
