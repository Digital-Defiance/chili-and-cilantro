import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ValidationError } from './validation-error';

export class InvalidGamePasswordError extends ValidationError {
  constructor() {
    super(
      `Must be alphanumeric and between ${constants.MIN_PASSWORD_LENGTH} and ${constants.MAX_PASSWORD_LENGTH}.`,
      'Invalid game password.',
    );
  }
}
