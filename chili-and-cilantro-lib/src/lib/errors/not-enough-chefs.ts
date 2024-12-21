import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { HandleableError } from './handleable-error';

export class NotEnoughChefsError extends HandleableError {
  constructor(present: number) {
    super(
      translate(StringNames.Error_NotEnoughChefsTemplate, undefined, {
        CHEFS_PRESENT: `${present}`,
      }),
      {
        statusCode: 422,
      },
    );
    this.name = 'NotEnoughChefsError';
    Object.setPrototypeOf(this, NotEnoughChefsError.prototype);
  }
}
