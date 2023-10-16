import { BaseError } from './baseError';
export class EmailExistsError extends BaseError {
  public readonly email: string;
  constructor(email: string) {
    super('Email already exists', 'EmailExistsError');
    this.email = email;
  }
}
