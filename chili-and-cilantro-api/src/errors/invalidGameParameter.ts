import { BaseError } from "./baseError";
import { ValidationError } from "./validationError";

export class InvalidGameParameterError extends ValidationError {
  constructor(message: string, parameter: string) {
    super(message, `Invalid game parameter: ${parameter}`);
  }
}