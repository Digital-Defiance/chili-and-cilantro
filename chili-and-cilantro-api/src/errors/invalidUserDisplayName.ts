import { ValidationError } from './validationError';
import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';

export class InvalidUserDisplayNameError extends ValidationError {
  constructor(displayName: string) {
    super(
      `Invalid user display name "${displayName}": Must be alphanumeric and between ${constants.MIN_USER_DISPLAY_NAME_LENGTH} and ${constants.MAX_USER_DISPLAY_NAME_LENGTH} characters long.`,
      'Invalid user display name.'
    );
  }
}
