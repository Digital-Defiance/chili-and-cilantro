import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class AllCardsPlacedError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_AllCardsPlaced));
    this.name = 'AllCardsPlacedError';
    Object.setPrototypeOf(this, AllCardsPlacedError.prototype);
  }
}
