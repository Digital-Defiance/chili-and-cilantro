import { Schema } from "mongoose";
import { ICreateGameAction } from "../interfaces/createGameAction";
import { ICreateGameDetails } from "../interfaces/createGameDetails";

export const CreateGameDetailsSchema = new Schema<ICreateGameDetails>({}, { _id: false });

export const CreateGameActionSchema = new Schema<ICreateGameAction>(
  {
    details: { type: CreateGameDetailsSchema, required: true },
  });