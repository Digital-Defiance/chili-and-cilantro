import { Schema } from 'mongoose';
import { IStartNewRoundDetails } from '../interfaces/startNewRoundDetails';
import { IStartNewRoundAction } from '../interfaces/startNewRoundAction';

export const StartNewRoundDetailsSchema = new Schema<IStartNewRoundDetails>(
  {},
  { _id: false }
);

export const StartNewRoundActionSchema = new Schema<IStartNewRoundAction>({
  details: { type: StartNewRoundDetailsSchema, required: true },
});
