import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { SigninDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';
import { JwtService as CustomJwtService } from './jwt.service';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: CustomJwtService);
    signin(signinDto: SigninDto): Promise<AuthResponseDto>;
    signout(userEmail: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto>;
    validateUser(email: string, password: string): Promise<User | null>;
}
