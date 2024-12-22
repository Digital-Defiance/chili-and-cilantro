import { IHasID } from '../../has-id';
import { ICreateGameAction } from '../../models/actions/create-game';

export interface ICreateGameActionObject
  extends ICreateGameAction<string>,
    IHasID<string> {}
