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

  @Expose()
  hasPassedSpecialTest?: boolean;

  @Expose()
  response?: {
    id: number;
    status: string;
    createdAt: Date;
  };

  hasMyResponse: boolean;
}

export class VacancyWithResponsesDto {
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
  updatedAt: Date;

  @Expose()
  employer: {
    id: number;
    firstName: string;
    lastName: string;
    company: string;
  };

  @Expose()
  test: {
    id: number;
    title: string;
    type: string;
    description: string;
  } | null;

  @Expose()
  responses: Array<{
    id: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    seeker: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      company: string;
    };
    testResults: Array<{
      id: number;
      completedAt: Date;
      test: {
        id: number;
        title: string;
        type: string;
      };
      userAnswers: number;
    }>;
  }>;

  @Expose()
  totalResponses: number;

  @Expose()
  pendingResponses: number;

  @Expose()
  acceptedResponses: number;

  @Expose()
  rejectedResponses: number;
}

export type VacancyResponseType =
  | VacancyResponseDto
  | VacancyWithResponsesDto
  | {
      id: number;
      title: string;
      description: string;
      salary_min: string;
      salary_max: string;
      is_active: boolean;
      createdAt: Date;
      updatedAt: Date;
      employer: {
        id: number;
        firstName: string;
        lastName: string;
        company: string;
      };
      test: {
        id: number;
        title: string;
        type: string;
        description: string;
      } | null;
    };
