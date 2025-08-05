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
  @IsNotEmpty()
  middleName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  company?: string;

  // @IsInt()
  // @Min(0)
  // @Max(1)
  // gender: 0 | 1;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsEnum(UserGender)
  @IsNotEmpty()
  gender: UserGender;
}

export class RegistrationResponseDto {
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  company?: string;
  gender: UserGender;
  role: UserRole;
}
