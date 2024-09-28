import { ValidationError } from './validation-error';

export class GameFullError extends ValidationError {
  constructor() {
    super('Game is full.');
    Object.setPrototypeOf(this, GameFullError.prototype);
  }
}
