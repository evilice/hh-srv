import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateQuestionDto } from '../question/dto/question.dto';
import { CreateAnswerDto } from '../answer/dto/answer.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { QuestionsService } from './question.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.deleteQuestion(id);
  }

  @Post(':id/answers')
  @Roles(UserRole.ADMIN)
  async addAnswer(
    @Param('id', ParseIntPipe) questionId: number,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.questionsService.addAnswer(questionId, createAnswerDto);
  }

  @Delete('answers/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAnswer(@Param('id', ParseIntPipe) id: number) {
    return await this.questionsService.deleteAnswer(id);
  }
}
