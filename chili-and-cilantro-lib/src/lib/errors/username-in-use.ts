import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class UsernameInUseError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_UsernameInUse));
    this.name = 'UsernameInUseError';
    Object.setPrototypeOf(this, UsernameInUseError.prototype);
  }
}
