import { Schema } from 'mongoose';
import { IEndGameAction } from '../interfaces/endGameAction';
import { IEndGameDetails } from '../interfaces/endGameDetails';

export const EndGameDetailsSchema = new Schema<IEndGameDetails>(
  {},
  { _id: false }
);

export const EndGameActionSchema = new Schema<IEndGameAction>({
  details: { type: EndGameDetailsSchema, required: true },
});
