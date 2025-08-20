import {
  Controller,
  Post,
  Delete,
  Put,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateResponseDto, UpdateResponseDto } from './dto/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities';
import { RequestWithUser } from 'src/vacancy/vacancy.controller';
import { ResponseService } from './response.service';

@Controller('responses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResponsesController {
  constructor(private readonly responsesService: ResponseService) {}

  // Создание отклика (только для seeker)
  @Post()
  @Roles(UserRole.SEEKER)
  async createResponse(
    @Body() createResponseDto: CreateResponseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.responsesService.createResponse(createResponseDto, req.user);
  }

  // Удаление отклика (только для seeker)
  @Delete(':id')
  @Roles(UserRole.SEEKER)
  async deleteResponse(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: RequestWithUser,
  ) {
    return this.responsesService.deleteResponse(id, req.user.id);
  }

  // Изменение статуса отклика (только для employer)
  @Put(':id/status')
  @Roles(UserRole.EMPLOYER)
  async updateResponseStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResponseDto: UpdateResponseDto,
    @Req() req: RequestWithUser,
  ) {
    return this.responsesService.updateResponseStatus(
      id,
      updateResponseDto,
      req.user.id,
    );
  }

  // Получение откликов для employer
  @Get('employer')
  @Roles(UserRole.EMPLOYER)
  async getEmployerResponses(@Req() req: RequestWithUser) {
    return this.responsesService.getEmployerResponses(req.user.id);
  }

  // Получение откликов для seeker
  @Get('seeker')
  @Roles(UserRole.SEEKER)
  async getSeekerResponses(@Req() req: RequestWithUser) {
    return this.responsesService.getSeekerResponses(req.user.id);
  }
}
