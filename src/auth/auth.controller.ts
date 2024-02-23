import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    try {
      return await this.authService.signIn(signInDto.email, signInDto.password);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() signUpDto: Record<string, any>) {
    try {
      return await this.authService.signUp(signUpDto);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    try {
      return await this.authService.verifyEmail(token);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('password_reset_request')
  async passwordResetRequest(@Body() resetPasswordDto: Record<string, any>) {
    try {
      return await this.authService.sendPasswordResetEmail(
        resetPasswordDto.email,
      );
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('reset_password')
  async verifyResetToken(@Query('token') token: string) {
    try {
      return await this.authService.verifyPasswordResetToken(token);
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('change_password')
  async changePassword(@Body() changePasswordDto: Record<string, any>) {
    const { password, token } = changePasswordDto;
    try {
      return await this.authService.changePassword(password, token);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
