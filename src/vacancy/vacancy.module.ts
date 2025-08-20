import { Module } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyController } from './vacancy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacancyEntity } from './vacancy.entity';
import { TestEntity, ResponseEntity } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResponseEntity, VacancyEntity, TestEntity]),
  ],
  controllers: [VacancyController],
  providers: [VacancyService],
})
export class VacancyModule {}
