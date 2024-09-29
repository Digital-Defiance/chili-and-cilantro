import {
  IUserDocument,
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Connection, Model } from 'mongoose';
import { UserSchema } from '../schemas/user';

export const UserModel = (connection: Connection): Model<IUserDocument> =>
  connection.model<IUserDocument>(
    ModelName.User,
    UserSchema,
    ModelNameCollection.User,
  );

export default UserModel;
