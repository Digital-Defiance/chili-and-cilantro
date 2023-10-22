import { Schema } from "mongoose";
import { CardType } from "../enumerations/cardType";
import { IHasID } from "./hasId";

export interface ICard extends IHasID {
  type: CardType;
  faceUp: boolean;
  owner: Schema.Types.ObjectId;
}