import { Module } from '@nestjs/common';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestEntity, TestResultEntity, User } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestResultEntity,
      TestEntity, // Нужен для связи с тестами
      User, // Нужен для связи с пользователями
    ]),
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}
