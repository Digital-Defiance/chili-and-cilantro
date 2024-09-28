import { IHasID } from '../../has-id';
import { IMessageAction } from '../../models/actions/message';

export interface IMessageActionObject extends IMessageAction, IHasID {}
