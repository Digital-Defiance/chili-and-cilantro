import { IHasID } from "../../has-id";
import { IEndGameAction } from "../../models/actions/end-game";

export interface IEndGameActionObject extends IEndGameAction, IHasID {};