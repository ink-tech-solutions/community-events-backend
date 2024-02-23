import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { DuplicateEmailError } from '../errors/duplicate-email.error';
import { BadRequestError } from 'src/errors/bad-request.error';
import generateUniqueToken from 'src/utils/generateUniqueToken';
import { EmailService } from 'src/email/email.service';

// Function to extract field-specific errors from the error message
const extractFieldErrors = (errorMessage: string) => {
  const fieldErrors: { [key: string]: string } = {};

  // Split the error message into individual error messages for each field
  const errorMessages = errorMessage.split('} {');

  errorMessages.forEach((msg) => {
    const cleanedMsg = msg.replace(/[\[\]{}"]/g, ''); // Remove brackets, braces, and quotes
    const [fieldName, errorMsg] = cleanedMsg.split(':');
    if (fieldName && errorMsg) {
      fieldErrors[fieldName] = errorMsg.trim();
    }
  });

  return fieldErrors;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async signIn(email, pass) {
    if (!email || !pass) {
      throw new BadRequestError(
        'Please provide both email and password for login.',
      );
    }

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

    const isPasswordValid = await user.comparePasswords(pass);

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Authentication failed. Please ensure your password is correct.',
      );
    }

    const payload = { sub: user.id, email: user.email };
    return {
      statusCode: 200,
      message: 'Login successful.',
      access_token: await this.jwtService.signAsync(payload),
      email: user.email,
      userName: user.name,
      avatar: user.avatar,
    };
  }

  async signUp(createUserDto: any) {
    const { name, email, password } = createUserDto;

    const missingFields = [];

    if (!name) {
      missingFields.push('name');
    }
    if (!email) {
      missingFields.push('email');
    }
    if (!password) {
      missingFields.push('password');
    }

    if (missingFields.length > 0) {
      throw new BadRequestError(`Please provide ${missingFields.join(', ')}.`);
    }

    try {
      // Attempt to create a new user

      const [verificationToken, verificationTokenExpires] =
        generateUniqueToken();
      const newUser = await this.userService.create({
        ...createUserDto,
        verificationToken: verificationToken,
        verificationTokenExpires: verificationTokenExpires,
      });
      // Send the verification email
      await this.emailService.sendVerificationEmail(
        newUser.name,
        newUser.email,
        verificationToken,
      );

      return {
        statusCode: 201,
        message: 'Created a new account. Check your email for verification.',
      };
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new DuplicateEmailError();
      } else {
        if (error.response && error.response.message) {
          const errorMessage = error.response.message;
          const fieldErrors = extractFieldErrors(errorMessage);
          throw new BadRequestException({
            message: 'Validation failed.',
            errors: fieldErrors,
          });
        } else {
          throw error; // Throw the original error if it doesn't contain the expected structure
        }
      }
    }
  }
  async verifyEmail(token: string): Promise<any> {
    try {
      const user = await this.userService.findUserWithVerificationToken(token);
      // Check if the user exists
      if (!user) {
        throw new NotFoundException('User not exist or invalid token');
      }

      // Check if the user is already verified
      if (user.isVerified) {
        throw new BadRequestError('Email is already verified');
      }

      // Check if the token has expired

      if (new Date(user.verificationTokenExpires) < new Date()) {
        // Remove unverified user from the database immediately
        await this.userService.delete(user.id);

        throw new BadRequestError(
          'Token has expired. You need to register your account again',
        );
      }

      // Update the user's isVerified field to true
      user.isVerified = true;
      await this.userService.update(user.id, { isVerified: true });

      return {
        statusCode: HttpStatus.OK,
        message: 'Email verification successful',
      };
    } catch (error) {
      throw error;
    }
  }
  async verifyPasswordResetToken(token: string): Promise<any> {
    try {
      const user = await this.userService.findUserWithPasswordResetToken(token);
      // Check if the user exists
      if (!user) {
        throw new NotFoundException('User not exist or invalid token');
      }

      // Check if the token has expired
      if (new Date(user.passwordResetTokenExpires) < new Date()) {
        throw new BadRequestError(
          'Token has expired. You need to get a new link to your email.',
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message:
          'Password reset token successfully verified. You can create your new password.',
      };
    } catch (error) {
      throw error;
    }
  }
  async sendPasswordResetEmail(email): Promise<any> {
    if (!email) {
      throw new BadRequestError(
        'Please provide email for getting reset password link.',
      );
    }
    try {
      const user = await this.userService.findOne(email);
      if (!user) {
        throw new NotFoundException('User not exist');
      }

      const [passwordResetToken, passwordResetTokenExpires] =
        generateUniqueToken();
      await this.emailService.sendPasswordResetEmail(
        user.name,
        user.email,
        passwordResetToken,
      );

      // Update the user's field
      user.passwordResetToken = passwordResetToken;
      user.passwordResetTokenExpires = passwordResetTokenExpires;
      await this.userService.update(user.id, {
        passwordResetToken,
        passwordResetTokenExpires,
      });

      return {
        statusCode: HttpStatus.OK,
        message:
          'An email for password reset has been sent to your email. Please check your email..',
      };
      // return {
      //   statusCode: 201,
      //   message: 'Created a new account',
      //   access_token: (await this.signIn(newUser.email, createUserDto.password))
      //     .access_token,
      // };
    } catch (error) {
      throw error;
    }
  }
  async changePassword(newPassword, resetToken): Promise<any> {
    if (!newPassword) {
      throw new BadRequestError('Please provide a new password.');
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!regex.test(newPassword)) {
      throw new BadRequestError(
        'Please create your password according to minimum requirements',
      );
    }

    try {
      const user =
        await this.userService.findUserWithPasswordResetToken(resetToken);
      // Check if the user exists
      if (!user) {
        throw new NotFoundException('User not exist or invalid token');
      }

      // Check if the token has expired
      if (new Date(user.passwordResetTokenExpires) < new Date()) {
        throw new BadRequestError(
          'Token has expired. You need to get a new link to your email.',
        );
      }

      //  Update the user's field to make the token expired
      const currentDate = new Date();
      user.passwordResetTokenExpires = currentDate;
      await this.userService.update(user.id, {
        passwordResetTokenExpires: currentDate,
      });

      //change password
      user.password = newPassword;
      await this.userService.update(user.id, {
        password: newPassword,
      });
      await user.save();
      return {
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
