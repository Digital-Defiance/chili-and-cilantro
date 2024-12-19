import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class InvalidUsernameError extends HandleableError {
  constructor() {
    super(translate(StringNames.Validation_UsernameRegexErrorTemplate), {
      statusCode: 400,
    });
    this.name = 'InvalidUsernameError';
    Object.setPrototypeOf(this, InvalidUsernameError.prototype);
  }
}
