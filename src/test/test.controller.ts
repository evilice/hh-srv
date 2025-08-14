import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole, User } from 'src/entities';
import { CreateTestDto } from './dto/test.dto';
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
  @Roles(UserRole.ADMIN)
  async findAllWithDetails(
    @Req() req: Request & { user: User },
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.testsService.findAllTests(req.user, page, limit);
  }
}
