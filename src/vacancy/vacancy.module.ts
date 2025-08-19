import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacancyEntity } from './vacancy.entity';
import { TestEntity } from '../test/test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VacancyEntity, TestEntity])],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}
