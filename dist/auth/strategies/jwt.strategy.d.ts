import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userRepository;
    constructor(userRepository: Repository<User>);
    validate(payload: any): Promise<{
        email: string;
        sub: string;
        role: import("../../user/user.entity").UserRole;
    } | null>;
}
export {};
