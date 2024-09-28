import { ValidationError } from './validation-error';

export class AllCardsPlacedError extends ValidationError {
  constructor() {
    super('All cards have been placed.');
    Object.setPrototypeOf(this, AllCardsPlacedError.prototype);
  }
}
