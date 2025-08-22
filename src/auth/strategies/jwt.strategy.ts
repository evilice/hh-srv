import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/user.entity';

// const { JWT_SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'mMEjJISTLAoTHUBvIqgsK6MvdIqdExpUeMf8Tr9aYET8vat6XdCUoADMbgRrEhgl',
      // secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      sub: user.email,
      role: user.role,
    };
  }
}
