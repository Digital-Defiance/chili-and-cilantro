import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class InvalidGameNameError extends ValidationError {
  constructor() {
    super(translate(StringNames.Validation_InvalidGameNameTemplate));
    this.name = 'InvalidGameNameError';
    Object.setPrototypeOf(this, InvalidGameNameError.prototype);
  }
}
