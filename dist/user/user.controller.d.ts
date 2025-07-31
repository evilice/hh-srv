import { UserService } from './user.service';
import { RegisterDto, RegistrationResponseDto } from './dto/user.dto';
export declare class UserController {
    private readonly authService;
    constructor(authService: UserService);
    register(registerDto: RegisterDto): Promise<RegistrationResponseDto>;
    getProfile(req: any): any;
}
