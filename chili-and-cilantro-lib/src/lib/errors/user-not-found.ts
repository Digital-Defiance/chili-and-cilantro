import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class UserNotFoundError extends HandleableError {
  constructor() {
    super(translate(StringNames.Error_UserNotFound), { statusCode: 404 });
    this.name = 'UserNotFound';
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
