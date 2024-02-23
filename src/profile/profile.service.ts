import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { BadRequestError } from 'src/errors/bad-request.error';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfileService {
  constructor(private userService: UserService) {}
  async uploadPhoto(email, profilePhoto) {
    if (!email) {
      throw new BadRequestError('You should be authenticated.');
    }
    if (!profilePhoto) {
      throw new BadRequestError('New profile photo should be provided.');
    }
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        throw new UnauthorizedException(
          'Authentication failed. Please ensure your email is correct.',
        );
      }

      if (!user.isVerified) {
        throw new UnauthorizedException(
          'Email not verified. Please confirm your email by clicking the link sent to your email address.',
        );
      }

      //change profile photo
      user.avatar = profilePhoto;
      await this.userService.update(user.id, {
        avatar: profilePhoto,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Profile photo updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
