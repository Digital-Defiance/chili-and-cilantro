import { HandleableError } from './handleable-error';

/**
 * Error thrown when a validation fails, sends a 400 status code with the validation error message
 */
export class ValidationError extends HandleableError {
  constructor(message: string, statusCode = 422) {
    super(message, { statusCode: statusCode });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
