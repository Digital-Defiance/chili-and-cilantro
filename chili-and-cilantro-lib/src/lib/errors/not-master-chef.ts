import { HandleableError } from './handleable-error';

export class NotMasterChefError extends HandleableError {
  constructor() {
    super(`User is not the Master Chef`, { statusCode: 422 });
    Object.setPrototypeOf(this, NotMasterChefError.prototype);
  }
}
