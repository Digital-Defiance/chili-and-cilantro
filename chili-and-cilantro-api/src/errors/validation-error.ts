import { BaseError } from './base-error';

export abstract class ValidationError extends BaseError {
  constructor(message: string, field: string) {
    super(message, `Validation error: ${field}`);
  }
}
