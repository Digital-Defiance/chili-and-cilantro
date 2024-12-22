import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class NotFoundError extends HandleableError {
  constructor() {
    super(translate(StringNames.Error_NotFound), { statusCode: 404 });
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
