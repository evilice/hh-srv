import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacancyEntity } from './vacancy.entity';
import { TestEntity, ResponseEntity, TestResultEntity } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResponseEntity,
      VacancyEntity,
      TestEntity,
      TestResultEntity,
    ]),
  ],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}
