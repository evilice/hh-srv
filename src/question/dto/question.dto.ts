import { Transform } from 'class-transformer';
import { QuestionType } from '../../entities';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  score?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  testId: number;

  @IsOptional()
  image?: Express.Multer.File;
}

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  questionText?: string;

  @IsOptional()
  @IsString()
  questionType?: QuestionType;

  @IsOptional()
  @IsNumber()
  score?: number;
}
