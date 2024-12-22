import { IHasID } from '../has-id';
import { IEmailToken } from '../models/email-token';

export interface IEmailTokenObject
  extends IEmailToken<string>,
    IHasID<string> {}
