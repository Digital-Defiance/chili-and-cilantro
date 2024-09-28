import { ValidationError } from './validation-error';

export class GameUsernameInUseError extends ValidationError {
  constructor() {
    super('Name is already in use within this game.');
    Object.setPrototypeOf(this, GameUsernameInUseError.prototype);
  }
}
