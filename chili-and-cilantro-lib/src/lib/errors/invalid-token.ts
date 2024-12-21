import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class InvalidTokenError extends HandleableError {
  constructor() {
    super(translate(StringNames.Validation_InvalidToken), { statusCode: 400 });
    this.name = 'InvalidTokenError';
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}
