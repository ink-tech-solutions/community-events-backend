import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('upload_photo')
  async uploadPhoto(@Body() signInDto: Record<string, any>) {
    try {
      return await this.profileService.uploadPhoto(
        signInDto.email,
        signInDto.profilePhoto,
      );
    } catch (error) {
      throw error;
    }
  }
}
