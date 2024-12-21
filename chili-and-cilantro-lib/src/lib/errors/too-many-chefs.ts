import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class TooManyChefsError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_TooManyChefs));
    this.name = 'TooManyChefsError';
    Object.setPrototypeOf(this, TooManyChefsError.prototype);
  }
}
