import { Module } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { UserAnswerController } from './user-answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AnswerEntity,
  QuestionEntity,
  TestResultEntity,
  UserAnswerEntity,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserAnswerEntity,
      TestResultEntity,
      QuestionEntity,
      AnswerEntity,
    ]),
  ],
  controllers: [UserAnswerController],
  providers: [UserAnswerService],
})
export class UserAnswerModule {}
