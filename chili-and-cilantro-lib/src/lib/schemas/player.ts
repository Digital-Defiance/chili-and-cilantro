import { Schema } from "mongoose";
import { IPlayer } from "../interfaces/player";
import ModelName from "../enumerations/modelName";
import { ICard } from "../interfaces/card";
import { CardType } from "../enumerations/cardType";
import { PlayerState } from "../enumerations/playerState";

export const CardSchema = new Schema<ICard>({
  type: { type: String, enum: Object.values(CardType), required: true },
  faceUp: { type: Boolean, required: true },
}, { _id: false });

export const PlayerSchema = new Schema<IPlayer>({
  gameId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.Game },
  hand: [CardSchema],
  userId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.User },
  state: { type: String, enum: Object.values(PlayerState), required: true },
  owner: { type: Boolean, required: true, default: false },
}, { timestamps: true })