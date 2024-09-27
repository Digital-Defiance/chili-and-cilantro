import { constants } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ValidationError } from './validation-error';

export class InvalidGameNameError extends ValidationError {
  constructor() {
    super(
      `Must be alphanumeric and between ${constants.MIN_GAME_NAME_LENGTH} and ${constants.MAX_GAME_NAME_LENGTH}.`,
      'Invalid game name.',
    );
  }
}
