import { ConflictError } from './conflict.error';

export class DuplicateEmailError extends ConflictError {
  constructor() {
    super('This email is already in use. Please use another email.');
  }
}
