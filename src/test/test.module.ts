import { Module } from '@nestjs/common';
import { TestsService } from '../test/test.service';
import { TestEntity } from '../test/test.entity';
import { TestsController } from '../test/test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AnswerEntity,
  QuestionEntity,
  ResponseEntity,
  TestResultEntity,
  User,
  UserAnswerEntity,
  VacancyEntity,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestEntity,
      User,
      VacancyEntity,
      TestResultEntity,
      UserAnswerEntity,
      QuestionEntity, // Добавляем
      AnswerEntity, // Добавляем
      ResponseEntity, // Добавляем (если используется)
    ]),
  ],
  providers: [TestsService], // Добавляем TestService
  controllers: [TestsController], // Добавляем TestController
  exports: [TestsService], // Экспортируем если нужно использовать в других модулях
})
export class TestModule {}
