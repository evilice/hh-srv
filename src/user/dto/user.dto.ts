import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
import { UserRole } from "../user.entity";

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
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @Min(0)
  @Max(1)
  gender: 0 | 1;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class RegistrationResponseDto {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 0 | 1;
  role: UserRole;
}
