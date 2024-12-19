import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class InvalidPasswordError extends HandleableError {
  constructor() {
    super(translate(StringNames.Validation_PasswordRegexErrorTemplate), {
      statusCode: 401,
    });
    this.name = 'InvalidPassword';
    Object.setPrototypeOf(this, InvalidPasswordError.prototype);
  }
}
