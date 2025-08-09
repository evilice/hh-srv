import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  Request as NestRequest,
} from '@nestjs/common';
import { Request, Response } from 'express'; // Импортируем из express
import { AuthService } from './auth.service';
import { SigninDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { RolesGuard } from './guards/roles.guard';
// import { Roles } from './decorators/roles.decorator';
// import { UserRole } from '../user/user.entity';

export interface JwtPayload {
  email: string;
  sub: string; // Обычно содержит user ID или email
  role: string; // Ваша кастомная роль
}

interface AuthRequest extends Request {
  user: JwtPayload; // Используем наш интерфейс
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(
    @Body() signinDto: SigninDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.signin(signinDto, req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signout(
    @NestRequest() req: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    return this.authService.signout(req.user.email, res);
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(req, res);
  }

  // Role-protected endpoints examples
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  // @Get('admin-only')
  // adminOnly(@Request() req) {
  //   return { message: 'Admin access granted', user: req.user };
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.EMPLOYER)
  // @Get('employer-only')
  // employerOnly(@Request() req) {
  //   return { message: 'Employer access granted', user: req.user };
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.SEEKER)
  // @Get('seeker-only')
  // seekerOnly(@Request() req) {
  //   return { message: 'Seeker access granted', user: req.user };
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  // @Get('admin-or-employer')
  // adminOrEmployer(@Request() req) {
  //   return { message: 'Admin or Employer access granted', user: req.user };
  // }
}
