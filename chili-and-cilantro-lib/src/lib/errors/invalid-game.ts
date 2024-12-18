import { ValidationError } from './validation-error';

export class InvalidGameError extends ValidationError {
  constructor() {
    super('Invalid game ID or game does not exist.');
    Object.setPrototypeOf(this, InvalidGameError.prototype);
  }
}
