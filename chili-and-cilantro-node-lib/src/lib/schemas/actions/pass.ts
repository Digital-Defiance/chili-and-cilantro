import { Schema } from 'mongoose';
import { IPassActionDocument, IPassDetails } from '@chili-and-cilantro/chili-and-cilantro-lib';

export const PassDetailsSchema = new Schema<IPassDetails>({}, { _id: false });

export const PassActionSchema = new Schema<IPassActionDocument>({
  details: { type: PassDetailsSchema, required: true },
});
