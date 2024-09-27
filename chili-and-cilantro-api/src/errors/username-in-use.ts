import { ValidationError } from './validation-error';

export class UsernameInUseError extends ValidationError {
  constructor() {
    super('Name is already in use within this game.', 'name');
  }
}
