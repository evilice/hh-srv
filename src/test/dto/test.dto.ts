import { TestType } from '../test.entity';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
} from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TestType)
  type: TestType;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateTestDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: TestType;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
