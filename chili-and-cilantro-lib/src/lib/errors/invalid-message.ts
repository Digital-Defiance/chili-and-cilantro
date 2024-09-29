import constants from '../constants';
import { ValidationError } from './validation-error';

export class InvalidMessageError extends ValidationError {
  constructor() {
    super(
      `Message must be between ${constants.MIN_MESSAGE_LENGTH} and ${constants.MAX_MESSAGE_LENGTH} characters long.`,
    );
    Object.setPrototypeOf(this, InvalidMessageError.prototype);
  }
}
