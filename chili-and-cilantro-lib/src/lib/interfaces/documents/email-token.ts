import { DefaultIdType } from '../../shared-types';
import { IEmailToken } from '../models/email-token';
import { IBaseDocument } from './base';

/**
 * Composite interface for email token collection documents
 */
export interface IEmailTokenDocument<I = DefaultIdType>
  extends IBaseDocument<IEmailToken, I>,
    IEmailToken {}
