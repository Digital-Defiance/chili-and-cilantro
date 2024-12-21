import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class InvalidMessageError extends ValidationError {
  constructor() {
    super(translate(StringNames.Validation_MessageRegexErrorTemplate));
    this.name = 'InvalidMessageError';
    Object.setPrototypeOf(this, InvalidMessageError.prototype);
  }
}
