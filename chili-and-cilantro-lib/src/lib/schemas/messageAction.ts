import { Schema } from "mongoose";
import { IMessageDetails } from "../interfaces/messageDetails";
import { IMessageAction } from "../interfaces/messageAction";

export const MessageDetailsSchema = new Schema<IMessageDetails>({
  message: { type: String, required: true },
}, { _id: false });

export const MessageActionSchema = new Schema<IMessageAction>(
  {
    details: { type: MessageDetailsSchema, required: true },
  });