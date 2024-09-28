import {
  IMakeBidActionDocument,
  IMakeBidDetails,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';

export const MakeBidDetailsSchema = new Schema<IMakeBidDetails>(
  {
    bidNumber: { type: Number, required: true },
  },
  { _id: false },
);

export const MakeBidActionSchema = new Schema<IMakeBidActionDocument>({
  details: { type: MakeBidDetailsSchema, required: true },
});
