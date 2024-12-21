import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class UsernameOrEmailRequiredError extends ValidationError {
  constructor() {
    super(translate(StringNames.Login_UsernameOrEmailRequired));
    this.name = 'UsernameOrEmailRequiredError';
    Object.setPrototypeOf(this, UsernameOrEmailRequiredError.prototype);
  }
}
