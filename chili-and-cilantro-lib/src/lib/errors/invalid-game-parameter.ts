import { ValidationError } from './validation-error';

export class InvalidGameParameterError extends ValidationError {
  constructor(parameter: string) {
    super(`Invalid game parameter: ${parameter}`);
    Object.setPrototypeOf(this, InvalidGameParameterError.prototype);
  }
}
