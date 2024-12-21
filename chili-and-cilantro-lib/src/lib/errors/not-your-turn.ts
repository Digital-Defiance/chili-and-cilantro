import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class NotYourTurnError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_NotYourTurn));
    this.name = 'NotYourTurnError';
    Object.setPrototypeOf(this, NotYourTurnError.prototype);
  }
}
