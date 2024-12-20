import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { ValidationError } from './validation-error';

export class AlreadyJoinedError extends ValidationError {
  constructor() {
    super(translate(StringNames.Error_YouAlreadyJoined));
    this.name = 'AlreadyJoinedError';
    Object.setPrototypeOf(this, AlreadyJoinedError.prototype);
  }
}
