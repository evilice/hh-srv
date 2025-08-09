import {
  Injectable,
  // ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { SigninDto, AuthResponseDto } from './dto/auth.dto';
import { JwtService as CustomJwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: CustomJwtService,
  ) {}

  async signin(
    signinDto: SigninDto,
    req: Request,
    res: Response,
  ): Promise<AuthResponseDto> {
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

    if (res) {
      res.cookie('refreshToken', tokens.refreshToken, {
        // httpOnly: true,
        // secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/auth',
      });
    }

    return {
      accessToken: tokens.accessToken,
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

  async signout(
    userEmail: string,
    res?: Response,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.lastVisit = new Date();
    await this.userRepository.save(user);

    if (res) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        // secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        path: '/auth',
      });
    }

    return {
      message: 'Successfully signed out. All tokens invalidated.',
    };
  }

  async refreshToken(req: Request, res?: Response): Promise<AuthResponseDto> {
    const refreshToken = req.cookies.refreshToken as string;

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

    if (res) {
      res.cookie('refreshToken', tokens.refreshToken, {
        // httpOnly: true,
        // secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/auth',
      });
    }

    return {
      accessToken: tokens.accessToken,
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
