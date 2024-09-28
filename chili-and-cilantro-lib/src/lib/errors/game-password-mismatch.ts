import { ValidationError } from './validation-error';

export class GamePasswordMismatchError extends ValidationError {
  constructor() {
    super('Game password does not match.');
    Object.setPrototypeOf(this, GamePasswordMismatchError.prototype);
  }
}
