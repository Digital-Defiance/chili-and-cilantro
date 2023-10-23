import { BaseError } from "./baseError";
export class InvalidEmailError extends BaseError {
  public readonly email: string;

  constructor(email: string) {
    super('Invalid Email Address', 'InvalidEmail');
    this.email = email;
  }
}
