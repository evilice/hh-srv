import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, RefreshTokenDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../user/user.entity';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signin(@Body() signinDto: SigninDto): Promise<AuthResponseDto> {
    return this.authService.signin(signinDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async signout(@Request() req): Promise<{ message: string }> {
    return this.authService.signout(req.user.email);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  // Role-protected endpoints examples
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  adminOnly(@Request() req) {
    return { message: 'Admin access granted', user: req.user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @Get('employer-only')
  employerOnly(@Request() req) {
    return { message: 'Employer access granted', user: req.user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SEEKER)
  @Get('seeker-only')
  seekerOnly(@Request() req) {
    return { message: 'Seeker access granted', user: req.user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EMPLOYER)
  @Get('admin-or-employer')
  adminOrEmployer(@Request() req) {
    return { message: 'Admin or Employer access granted', user: req.user };
  }
}
