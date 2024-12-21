import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class GamePasswordMismatchError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_GamePasswordMismatch));
    this.name = 'GamePasswordMismatchError';
    Object.setPrototypeOf(this, GamePasswordMismatchError.prototype);
  }
}
