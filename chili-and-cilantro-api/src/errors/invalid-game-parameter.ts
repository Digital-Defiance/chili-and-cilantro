import { ValidationError } from './validation-error';

export class InvalidGameParameterError extends ValidationError {
  constructor(message: string, parameter: string) {
    super(message, `Invalid game parameter: ${parameter}`);
  }
}
