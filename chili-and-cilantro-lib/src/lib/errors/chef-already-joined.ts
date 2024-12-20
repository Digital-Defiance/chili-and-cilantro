import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class ChefAlreadyJoinedError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_ChefAlreadyInGame));
    this.name = 'ChefAlreadyJoinedError';
    Object.setPrototypeOf(this, ChefAlreadyJoinedError.prototype);
  }
}
