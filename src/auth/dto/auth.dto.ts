import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../user/user.entity';

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: 0 | 1;
    role: UserRole;
  };
} 