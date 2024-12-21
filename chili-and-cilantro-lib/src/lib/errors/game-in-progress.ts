import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class GameInProgressError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_GameAlreadyInProgress));
    this.name = 'GameInProgressError';
    Object.setPrototypeOf(this, GameInProgressError.prototype);
  }
}
