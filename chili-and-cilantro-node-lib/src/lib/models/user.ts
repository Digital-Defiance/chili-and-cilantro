import { IUserDocument, ModelName, ModelNameCollection } from "@chili-and-cilantro/chili-and-cilantro-lib";
import { model } from "mongoose";
import { UserSchema } from "../schemas/user";

export const UserModel = model<IUserDocument>(ModelName.User, UserSchema, ModelNameCollection.User);

export default UserModel;