import { ValidationError } from './validationError';
import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';

export class InvalidUsernameError extends ValidationError {
  constructor(username: string) {
    super(
      `Invalid username "${username}": Must be alphanumeric and between ${constants.MIN_USERNAME_LENGTH} and ${constants.MAX_USERNAME_LENGTH} characters long.`,
      'Invalid username.'
    );
  }
}
