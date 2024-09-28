import { IMongoErrors } from '../mongo-errors';
import { IApiMessageResponse } from './api-message-response';

export interface IApiMongoValidationErrorResponse extends IApiMessageResponse {
  errors: IMongoErrors;
}
