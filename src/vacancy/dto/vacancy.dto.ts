import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  testId?: number;
}

export class UpdateVacancyDto extends CreateVacancyDto {}

export class VacancyResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  salary_min: string;

  @Expose()
  salary_max: string;

  @Expose()
  is_active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  employer: {
    id: number;
    firstName: string;
    lastName: string;
    company: string;
  };
}
