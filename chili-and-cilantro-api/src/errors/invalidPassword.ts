import { BaseError } from "./baseError";
export class InvalidPasswordError extends BaseError {
  constructor(message: string) {
    super(message, 'InvalidPassword');
  }
}
