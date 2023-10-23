import { ValidationError } from "./validationError";

export class InvalidEmailError extends ValidationError {
  public readonly email: string;

  constructor(email: string) {
    super('Invalid email address.', 'Invalid email.');
    this.email = email;
  }
}
