import constants from '../constants';

export class InvalidUsernameError extends Error {
  constructor() {
    super(constants.USERNAME_REGEX_ERROR);
    this.name = 'InvalidUsernameError';
    Object.setPrototypeOf(this, InvalidUsernameError.prototype);
  }
}
