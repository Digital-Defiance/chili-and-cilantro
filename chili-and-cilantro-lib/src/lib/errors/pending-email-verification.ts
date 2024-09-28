import { AccountStatusTypeEnum } from '../enumerations/account-status-type';
import { AccountStatusError } from './account-status';

export class PendingEmailVerificationError extends AccountStatusError {
  constructor() {
    super(AccountStatusTypeEnum.NewUnverified);
    Object.setPrototypeOf(this, PendingEmailVerificationError.prototype);
  }
}
