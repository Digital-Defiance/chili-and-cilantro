import { ValidationError } from './validationError';

export class EmailExistsError extends ValidationError {
  public readonly email: string;
  constructor(email: string) {
    super(`Email address already exists: ${email}`, 'Email already exists.');
    this.email = email;
  }
}
