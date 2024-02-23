import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom.error';

export class UnauthenticatedError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
