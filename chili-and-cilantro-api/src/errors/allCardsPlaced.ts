import { ValidationError } from "./validationError";

export class AllCardsPlacedError extends ValidationError {
  constructor() {
    super('All cards have been placed.', 'chef.hand');
  }
}