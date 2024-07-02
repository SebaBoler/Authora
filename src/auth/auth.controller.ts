import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { EmailService } from '../email/email.service';
import { CreateUserDto, UserService } from '@user/index';
import { LogInDto } from './dto/logIn-in.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LogInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(loginDto);
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return user;
  }

  @HttpCode(200)
  @Post('log-out')
  async logOut(@Res({ passthrough: true }) response: Response) {
    const cookie = this.authService.getCookieForLogOut();
    response.setHeader('Set-Cookie', cookie);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    const activationCode = this.userService.generateActivationCode();
    await this.emailService.sendEmail(
      user.email,
      'Account Activation',
      `Your activation code is: ${activationCode}`,
    );
    await this.userService.saveActivationCode(user.id, activationCode);
    return {
      message:
        'User registered successfully. Please check your email for activation instructions.',
    };
  }

  @Post('activate/:code')
  async activate(@Param('code') code: string) {
    await this.userService.activateUser(code);
    return { message: 'Account activated successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  getAdminData(@Request() req) {
    return { message: 'This is admin data', user: req.user };
  }
}
