import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class InvalidGameError extends ValidationError {
  constructor() {
    super(translate(StringNames.Validation_InvalidGame));
    this.name = 'InvalidGameError';
    Object.setPrototypeOf(this, InvalidGameError.prototype);
  }
}
