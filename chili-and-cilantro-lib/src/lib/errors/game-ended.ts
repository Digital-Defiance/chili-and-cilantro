import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class GameEndedError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_GameEnded));
    this.name = 'GameEndedError';
    Object.setPrototypeOf(this, GameEndedError.prototype);
  }
}
