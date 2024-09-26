import { ValidationError } from './validationError';

export class GameInProgressError extends ValidationError {
  constructor() {
    super('Game is already in progress.', 'Game in progress.');
  }
}
