import { Schema } from "mongoose";

export interface IMessageDetails {
  message: string;
  sender: Schema.Types.ObjectId;
}