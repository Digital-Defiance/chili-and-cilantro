import {
  IStartNewRoundActionDocument,
  IStartNewRoundDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const StartNewRoundDetailsSchema = new Schema<IStartNewRoundDetails>(
  {},
  { _id: false },
);

export const StartNewRoundActionSchema =
  new Schema<IStartNewRoundActionDocument>({
    details: { type: StartNewRoundDetailsSchema, required: true },
  });
