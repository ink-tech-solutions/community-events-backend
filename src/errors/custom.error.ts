import { HttpStatus } from '@nestjs/common';

export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: HttpStatus,
  ) {
    super(message);
  }
}
