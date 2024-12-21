import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class IncorrectGamePhaseError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_GameInvalidPhase));
    this.name = 'IncorrectGamePhaseError';
    Object.setPrototypeOf(this, IncorrectGamePhaseError.prototype);
  }
}
