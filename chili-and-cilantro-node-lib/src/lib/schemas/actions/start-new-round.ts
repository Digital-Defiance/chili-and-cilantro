import { Schema } from 'mongoose';
import { IStartNewRoundActionDocument, IStartNewRoundDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const StartNewRoundDetailsSchema = new Schema<IStartNewRoundDetails>(
  {},
  { _id: false },
);

export const StartNewRoundActionSchema = new Schema<IStartNewRoundActionDocument>({
  details: { type: StartNewRoundDetailsSchema, required: true },
});
