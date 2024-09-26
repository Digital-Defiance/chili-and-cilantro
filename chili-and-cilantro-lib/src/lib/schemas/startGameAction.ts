import { Schema } from 'mongoose';
import { IStartGameDetails } from '../interfaces/startGameDetails';
import { IStartGameAction } from '../interfaces/startGameAction';

export const StartGameDetailsSchema = new Schema<IStartGameDetails>(
  {},
  { _id: false }
);

export const StartGameActionSchema = new Schema<IStartGameAction>({
  details: { type: StartGameDetailsSchema, required: true },
});
