import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { BadRequestError } from 'src/errors/bad-request.error';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    required: true,
    validate: {
      validator: (name: string) => {
        // Name validation logic
        const errors = [];

        if (name.length < 3) {
          errors.push('Name must be at least 3 characters long.');
        }
        if (name.length > 50) {
          errors.push('Name cannot be more than 50 characters long.');
        }

        if (errors.length > 0) {
          throw new BadRequestError(JSON.stringify({ name: errors }));
        }

        return true; // Name meets all conditions
      },
      message: 'Invalid name.', // This will be overridden if validation fails
    },
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    validate: {
      validator: isEmailValid,
      message: 'Please provide a valid email',
    },
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    validate: {
      validator: (password: string) => {
        // Password validation logic
        const errors = [];

        if (password.length < 6) {
          errors.push('6 characters');
        }
        if (!/(?=.*[a-z])/.test(password)) {
          errors.push('one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
          errors.push('one uppercase letter');
        }
        if (!/(?=.*\d)/.test(password)) {
          errors.push('one digit');
        }

        if (errors.length > 0) {
          throw new BadRequestError(
            JSON.stringify({
              password: `Password must include at least ${errors.join(', ')}.`,
            }),
          );
        }

        return true; // Password meets all conditions
      },
      message: 'Invalid password.', // This will be overridden if validation fails
    },
  })
  password: string;

  @Prop({
    default: 'default-avatar.png',
  })
  avatar: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verificationToken: string;

  @Prop()
  verificationTokenExpires: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetTokenExpires: Date;

  async comparePasswords(candidatePassword: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (error) {
      throw error;
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

function isEmailValid(value: string): boolean {
  // Custom email validation logic
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  if (!emailRegex.test(value)) {
    throw new BadRequestError(
      JSON.stringify({ email: 'Please provide a valid email.' }),
    );
  }
  return true;
  // return emailRegex.test(value);
}

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.comparePasswords = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};
