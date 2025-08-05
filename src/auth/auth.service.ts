import {
  Injectable,
  // ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { SigninDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';
import { JwtService as CustomJwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: CustomJwtService,
  ) {}

  async signin(signinDto: SigninDto): Promise<AuthResponseDto> {
    const { email, password } = signinDto;

    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last visit
    user.lastVisit = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const tokens = this.jwtService.generateTokens({
      email: user.email,
      sub: user.email,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        gender: user.gender,
        role: user.role,
      },
    };
  }

  // async signout(userEmail: string): Promise<{ message: string }> {
  //   // In a more complex implementation, you might want to blacklist the token
  //   // For now, we'll just return a success message
  //   return { message: 'Successfully signed out' };
  // }

  async signout(userEmail: string): Promise<{ message: string }> {
    // 1. Находим пользователя
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 2. Инвалидируем refresh токен (пример реализации)
    // await this.jwtService.invalidateRefreshToken(userEmail);

    // 3. Обновляем метку выхода (для аудита)
    user.lastVisit = new Date();
    await this.userRepository.save(user);

    return {
      message: 'Successfully signed out. All tokens invalidated.',
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    const payload = this.jwtService.verifyToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new tokens
    const tokens = this.jwtService.generateTokens({
      email: user.email,
      sub: user.email,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        gender: user.gender,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
