import { IHasID } from "../../has-id";
import { IJoinGameAction } from "../../models/actions/join-game";

export interface IJoinGameActionObject extends IJoinGameAction, IHasID {};