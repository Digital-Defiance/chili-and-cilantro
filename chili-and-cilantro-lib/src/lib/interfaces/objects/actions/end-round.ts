import { IHasID } from '../../has-id';
import { IEndRoundAction } from '../../models/actions/end-round';

export interface IEndRoundActionObject
  extends IEndRoundAction<string>,
    IHasID<string> {}
