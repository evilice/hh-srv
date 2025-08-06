import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserGender, UserRole } from '../user.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsEnum(UserGender)
  @IsOptional()
  gender: UserGender;
}

export class RegistrationResponseDto {
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  company?: string;
  gender?: UserGender;
  role: UserRole;
}
