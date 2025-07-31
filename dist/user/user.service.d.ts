import { Repository } from 'typeorm';
import { RegistrationResponseDto, RegisterDto } from './dto/user.dto';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(registerDto: RegisterDto): Promise<RegistrationResponseDto>;
}
