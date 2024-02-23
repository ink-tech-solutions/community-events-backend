import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { BadRequestError } from 'src/errors/bad-request.error';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  private transformValidationErrors(errors: Record<string, any>): string {
    const errorMessages: string[] = [];

    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        errorMessages.push(errors[field].message);
      }
    }

    return errorMessages.join(' ');
  }

  async create(createUserDto: any): Promise<User> {
    const { name, email, password } = createUserDto;

    try {
      const createdUser = await this.userModel.create(createUserDto);

      if (!name || !email || !password) {
        throw new BadRequestError(
          'Name, email, and password are required for user creation.',
        );
      }
      return createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw error;
      }
      const validationErrors = this.transformValidationErrors(error.errors);
      throw new BadRequestException(validationErrors);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(email): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserWithVerificationToken(token): Promise<User> {
    return this.userModel.findOne({ verificationToken: token }).exec();
  }

  async findUserWithPasswordResetToken(token): Promise<User> {
    return this.userModel.findOne({ passwordResetToken: token }).exec();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser.save();
    } catch (error) {
      throw error;
    }
  }

  async delete(userId: string): Promise<void> {
    await this.userModel.findByIdAndDelete(userId).exec();
  }

  async findUnverifiedUsersWithExpiredTokens(): Promise<User[]> {
    const now = new Date();
    return this.userModel
      .find({ isVerified: false, verificationTokenExpires: { $lte: now } })
      .exec();
  }
}
