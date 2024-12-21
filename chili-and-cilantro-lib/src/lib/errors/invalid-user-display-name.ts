import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class InvalidUserDisplayNameError extends ValidationError {
  public readonly displayName: string;
  constructor(displayName: string) {
    super(translate(StringNames.Validation_DisplayNameRegexErrorTemplate));
    this.displayName = displayName;
    this.name = 'InvalidUserDisplayNameError';
    Object.setPrototypeOf(this, InvalidUserDisplayNameError.prototype);
  }
}
