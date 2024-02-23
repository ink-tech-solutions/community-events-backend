import { HttpStatus } from '@nestjs/common';
import { CustomError } from './custom.error';

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
