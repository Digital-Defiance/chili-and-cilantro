import { BaseError } from './baseError';

export class InvalidUserError extends BaseError {
  constructor(idType: string, id: string) {
    super(`Invalid user by ${idType}: ${id}`, `InvalidUser.${idType}`);
  }
}
