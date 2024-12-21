import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class InvalidGamePasswordError extends ValidationError {
  constructor() {
    super(translate(StringNames.Validation_GamePasswordRegexErrorTemplate));
    this.name = 'InvalidGamePasswordError';
    Object.setPrototypeOf(this, InvalidGamePasswordError.prototype);
  }
}
