import { ValidationError } from "./validationError";

export class InvalidPasswordError extends ValidationError {
  constructor(message: string) {
    super(message, 'Invalid password.');
  }
}
