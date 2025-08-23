import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from '../entities';
import { ResultService } from './result.service';
import { RequestWithUser } from 'src/vacancy/vacancy.controller';

@Controller('results')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SEEKER)
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get('check/:type')
  async checkTestCompletion(
    @Param('type') type: 'iq' | 'psy',
    @Req() req: RequestWithUser,
  ) {
    const hasCompleted = await this.resultService.checkTestCompletion(
      req.user.id,
      type,
    );

    return {
      hasCompleted,
      testType: type,
      message: hasCompleted
        ? `Тест ${type.toUpperCase()} уже пройден`
        : `Тест ${type.toUpperCase()} еще не пройден`,
    };
  }

  @Get('check-special/:vacancyId') // vacancyId передаем как параметр пути
  async checkSpecialTestForVacancy(
    @Param('vacancyId', ParseIntPipe) vacancyId: number, // Получаем и парсим ID вакансии
    @Req() req: RequestWithUser,
  ) {
    const hasCompleted = await this.resultService.checkSpecialTestForVacancy(
      req.user.id, // ID текущего пользователя (seeker)
      vacancyId, // ID вакансии из запроса
    );

    return {
      hasCompleted,
      message: hasCompleted
        ? `Специальный тест для вакансии #${vacancyId} пройден`
        : `Специальный тест для вакансии #${vacancyId} не пройден`,
    };
  }

  //   @Get('my')
  //   async getMyResults(@Req() req: RequestWithUser) {
  //     return this.resultService.getUserResults(req.user.id);
  //   }
}
