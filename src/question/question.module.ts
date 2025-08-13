import { Module } from '@nestjs/common';
import { QuestionsController } from './question.controller';
import { QuestionsService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity, AnswerEntity, TestEntity } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestEntity, QuestionEntity, AnswerEntity]),
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionModule {}
