import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class GameDisplayNameInUseError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_GameDisplayNameAlreadyInUse));
    this.name = 'GameDisplayNameInUseError';
    Object.setPrototypeOf(this, GameDisplayNameInUseError.prototype);
  }
}
