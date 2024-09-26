import { ValidationError } from './validationError';

export class UsernameInUseError extends ValidationError {
  constructor() {
    super('Name is already in use within this game.', 'name');
  }
}
