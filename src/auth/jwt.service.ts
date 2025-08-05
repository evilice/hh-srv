import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

export interface JwtPayload {
  email: string;
  sub: string; // Обычно user ID или email
  iat?: number; // issued at
  exp?: number; // expiration time
  [key: string]: any; // Для кастомных полей
}

@Injectable()
export class JwtService {
  constructor(private jwtService: NestJwtService) {}
  private invalidatedTokens = new Set<string>();

  generateTokens(payload: { email: string; sub: string }) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): JwtPayload {
    // try {
    return this.jwtService.verify(token);
    // }
    // catch (error) {
    //   return null;
    // }
  }

  // invalidateRefreshToken(token: RefreshTokenDto): void {
  //   this.verifyToken(token);
  //   this.invalidatedTokens.add(token);

  //   // Очистка устаревших токенов
  //   setTimeout(
  //     () => {
  //       this.invalidatedTokens.delete(token);
  //     },
  //     7 * 24 * 60 * 60 * 1000,
  //   ); // Через 7 дней
  // }

  // async isUserInvalidated(userEmail: string): Promise<boolean> {
  //   const result = await this.redisService.getClient().exists(
  //     `invalidated:${userEmail}`
  //   );
  //   return result === 1;
  // }
}
