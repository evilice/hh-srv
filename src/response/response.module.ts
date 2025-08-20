import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, VacancyEntity, ResponseEntity } from '../entities';
import { ResponseService } from './response.service';
import { ResponsesController } from './response.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResponseEntity, User, VacancyEntity])],
  providers: [ResponseService],
  controllers: [ResponsesController],
})
export class ResponseModule {}
