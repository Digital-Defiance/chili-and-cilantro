import { ValidationError } from './validation-error';

export class GameInProgressError extends ValidationError {
  constructor() {
    super('Game is already in progress.');
    Object.setPrototypeOf(this, GameInProgressError.prototype);
  }
}
