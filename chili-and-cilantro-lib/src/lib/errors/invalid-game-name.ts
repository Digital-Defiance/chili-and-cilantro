import constants from '../constants';
import { ValidationError } from './validation-error';

export class InvalidGameNameError extends ValidationError {
  constructor() {
    super(
      `Invalid game name. Must be alphanumeric and between ${constants.MIN_GAME_NAME_LENGTH} and ${constants.MAX_GAME_NAME_LENGTH}.`,
    );
    Object.setPrototypeOf(this, InvalidGameNameError.prototype);
  }
}
