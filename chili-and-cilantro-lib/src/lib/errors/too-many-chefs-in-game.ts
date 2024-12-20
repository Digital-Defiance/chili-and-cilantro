import { ValidationError } from './validation-error';

export class TooManyChefsInGameError extends ValidationError {
  constructor() {
    super('Too many chefs in game');
    this.name = 'TooManyChefsInGameError';
    Object.setPrototypeOf(this, TooManyChefsInGameError.prototype);
  }
}
