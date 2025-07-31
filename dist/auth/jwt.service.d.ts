import { JwtService as NestJwtService } from '@nestjs/jwt';
export declare class JwtService {
    private jwtService;
    constructor(jwtService: NestJwtService);
    generateTokens(payload: {
        email: string;
        sub: string;
    }): {
        accessToken: string;
        refreshToken: string;
    };
    verifyToken(token: string): any;
}
