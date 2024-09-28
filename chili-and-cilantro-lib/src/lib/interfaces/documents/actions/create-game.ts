import { ICreateGameAction } from '../../models/actions/create-game';
import { IBaseDocument } from '../base';

export interface ICreateGameActionDocument
  extends ICreateGameAction,
    IBaseDocument<ICreateGameAction> {}
