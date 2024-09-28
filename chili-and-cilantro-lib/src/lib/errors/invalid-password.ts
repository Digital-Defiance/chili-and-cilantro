import constants from '../constants';

export class InvalidPasswordError extends Error {
  constructor() {
    super(constants.PASSWORD_REGEX_ERROR);
    this.name = 'InvalidPassword';
    Object.setPrototypeOf(this, InvalidPasswordError.prototype);
  }
}
