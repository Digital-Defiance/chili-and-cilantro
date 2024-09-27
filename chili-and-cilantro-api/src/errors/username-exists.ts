import { ValidationError } from './validation-error';
export class UsernameExistsError extends ValidationError {
  public readonly username: string;
  constructor(username: string) {
    super(`Username already exists: ${username}`, 'Invalid username.');
    this.username = username;
  }
}
