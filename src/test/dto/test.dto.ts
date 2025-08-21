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

// новые
export interface TestQuestionDto {
  id: number;
  questionText: string;
  questionType: string;
  score: number;
  imageUrl?: string;
  answers: TestAnswerDto[];
}

export interface TestAnswerDto {
  id: number;
  answerText: string;
  isCorrect?: boolean; // Только для админа, для пользователя не отправляем
}

export interface TestForVacancyDto {
  testId: number;
  title: string;
  description: string;
  questions: TestQuestionDto[];
}

export interface SubmitTestAnswersDto {
  answers: {
    questionId: number;
    answerIds?: number[]; // Для multiple choice
    answerId?: number; // Для single choice
    answerText?: string; // Для текстовых ответов
  }[];
}
