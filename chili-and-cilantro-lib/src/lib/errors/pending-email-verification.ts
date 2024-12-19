import { AccountStatusTypeEnum } from '../enumerations/account-status-type';
import { StringNames } from '../enumerations/string-names';
import { translate } from '../i18n';
import { AccountStatusError } from './account-status';

export class PendingEmailVerificationError extends AccountStatusError {
  constructor() {
    super(
      AccountStatusTypeEnum.NewUnverified,
      translate(StringNames.Error_AccountStatusIsPendingEmailVerification),
    );
    this.name = 'PendingEmailVerification';
    Object.setPrototypeOf(this, PendingEmailVerificationError.prototype);
  }
}
