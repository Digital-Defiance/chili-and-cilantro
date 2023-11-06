import { Schema } from "mongoose";
import { IJoinGameDetails } from "../interfaces/joinGameDetails";
import { IJoinGameAction } from "../interfaces/joinGameAction";

export const JoinGameDetailsSchema = new Schema<IJoinGameDetails>({}, { _id: false });

export const JoinGameActionSchema = new Schema<IJoinGameAction>(
  {
    details: { type: JoinGameDetailsSchema, required: true },
  });