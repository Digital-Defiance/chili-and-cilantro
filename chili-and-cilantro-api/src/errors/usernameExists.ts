import { BaseError } from "./baseError";
import { ValidationError } from "./validationError";
export class UsernameExistsError extends ValidationError {
  public readonly username: string;
  constructor(username: string) {
    super(`Username already exists: ${username}`, 'Invalid username.');
    this.username = username;
  }
}
