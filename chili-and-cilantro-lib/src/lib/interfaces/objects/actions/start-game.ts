import { IHasID } from '../../has-id';
import { IStartGameAction } from '../../models/actions/start-game';

export interface IStartGameActionObject
  extends IStartGameAction<string>,
    IHasID<string> {}
