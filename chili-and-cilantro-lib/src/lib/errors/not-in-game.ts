import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class NotInGameError extends ValidationError {
  constructor(statusCode = 422) {
    super(translate(StringNames.Error_NotInGame), statusCode);
    this.name = 'NotInGameError';
    Object.setPrototypeOf(this, NotInGameError.prototype);
  }
}
