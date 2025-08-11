import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto, RegistrationResponseDto } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

export interface JwtPayload {
  email: string;
  sub: string; // Обычно содержит user ID или email
  role: string; // Ваша кастомная роль
}

interface AuthRequest extends Request {
  user: JwtPayload; // Используем наш интерфейс
}

@Controller('user')
export class UserController {
  constructor(private readonly authService: UserService) {}

  @Post('registration')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegistrationResponseDto> {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthRequest) {
    return req.user;
  }
}
