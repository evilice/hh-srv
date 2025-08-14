import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;

  @IsNumber()
  questionId: number;
}

export class UpdateAnswerDto {
  @IsOptional()
  @IsString()
  answerText?: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;
}
