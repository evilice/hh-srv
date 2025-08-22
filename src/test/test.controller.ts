import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole, User } from 'src/entities';
import {
  CreateTestDto,
  SubmitTestAnswersDto,
  UpdateTestDto,
} from './dto/test.dto';
import { TestsService } from './test.service';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createTestDto: CreateTestDto,
    @Req() req: Request & { user: User },
  ) {
    return this.testsService.createTest(createTestDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.testsService.deleteTest(req.user, id);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  async findAllWithDetails(
    @Req() req: Request & { user: User },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.testsService.findAllTests(req.user, page, limit);
  }

  @Get('vacancy/:vacancyId')
  @Roles(UserRole.SEEKER)
  async getTestForVacancy(@Param('vacancyId', ParseIntPipe) vacancyId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.testsService.getTestForVacancy(vacancyId);
  }

  @Get('iq')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SEEKER)
  async getIqTest() {
    return this.testsService.getIqTestForSeeker();
  }

  // Создание ответа на вопрос
  @Post('submit/:testId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SEEKER)
  async submitTestAnswers(
    @Param('testId', ParseIntPipe) testId: number,
    @Body() submitDto: SubmitTestAnswersDto,
    @Req() req: Request & { user: User },
  ) {
    console.log('submitDto', submitDto);
    return this.testsService.submitTestAnswers(req.user.id, testId, submitDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTestDto: UpdateTestDto,
    @Req() req: Request & { user: User },
  ) {
    return this.testsService.updateTest(req.user, id, updateTestDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOneWithDetails(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: User },
  ) {
    return this.testsService.findTestWithDetails(req.user, id);
  }
}
