import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { VacancyEntity } from './vacancy.entity';
import { User, UserRole } from '../user/user.entity';
import { CreateVacancyDto } from './dto/vacancy.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('vacancies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post()
  @Roles(UserRole.EMPLOYER)
  async create(
    @Body() createVacancyDto: CreateVacancyDto,
    @Req() req: RequestWithUser,
  ): Promise<VacancyEntity> {
    return this.vacancyService.createVacancy(createVacancyDto, req.user);
  }

  @Delete(':vacancy_id')
  @Roles(UserRole.EMPLOYER)
  async delete(
    @Param('vacancy_id', ParseIntPipe) vacancyId: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    return this.vacancyService.deleteVacancy(vacancyId, req.user.id);
  }

  @Patch(':vacancy_id')
  @Roles(UserRole.EMPLOYER)
  async update(
    @Param('vacancy_id', ParseIntPipe) vacancyId: number,
    @Body() updateVacancyDto: Partial<VacancyEntity>,
    @Req() req: RequestWithUser,
  ): Promise<VacancyEntity> {
    return this.vacancyService.updateVacancy(
      vacancyId,
      req.user.id,
      updateVacancyDto,
    );
  }

  @Get('my-vacancies')
  @Roles(UserRole.EMPLOYER)
  async getMyVacancies(@Req() req: RequestWithUser): Promise<VacancyEntity[]> {
    return this.vacancyService.getEmployerVacancies(req.user.id);
  }

  @Get()
  @Roles(UserRole.SEEKER)
  async getAllVacancies(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.vacancyService.getAllActiveVacancies(page, limit);
  }
}
