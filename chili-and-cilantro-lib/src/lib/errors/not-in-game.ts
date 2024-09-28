import { ValidationError } from './validation-error';

export class NotInGameError extends ValidationError {
  constructor() {
    super('You are not in this game!');
    Object.setPrototypeOf(this, NotInGameError.prototype);
  }
}
