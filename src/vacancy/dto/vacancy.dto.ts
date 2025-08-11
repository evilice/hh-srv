import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateVacancyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  salary_min?: string;

  @IsString()
  @IsOptional()
  salary_max?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
