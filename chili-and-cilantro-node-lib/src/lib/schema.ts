import {
  IAction,
  IActionDocument,
  IBaseDocument,
  IChef,
  IChefDocument,
  IEmailToken,
  IEmailTokenDocument,
  IGame,
  IGameDocument,
  IUser,
  IUserDocument,
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Connection, Model, Schema as MongooseSchema } from 'mongoose';
import { SchemaMap } from '../types/shared-types';
import { ActionDiscriminators } from './discriminators/action';
import { ISchemaData } from './interfaces/schema-data';
import { ISchemaModelData } from './interfaces/schema-model-data';
import { ActionSchema } from './schemas/action';
import { ChefSchema } from './schemas/chef';
import { EmailTokenSchema } from './schemas/email-token';
import { GameSchema } from './schemas/game';
import { UserSchema } from './schemas/user';

function modelNameCollectionToPath(
  modelNameCollection: ModelNameCollection,
): string {
  return `/${modelNameCollection as string}`;
}

export const Schema: { [key in ModelName]: ISchemaData<IBaseDocument<any>> } = {
  [ModelName.Action]: {
    name: ModelName.Action,
    description: 'An action taken by a chef in a game.',
    collection: ModelNameCollection.Action,
    schema: ActionSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Action),
  },
  [ModelName.Chef]: {
    name: ModelName.Chef,
    description: 'A chef in a game.',
    collection: ModelNameCollection.Chef,
    schema: ChefSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Chef),
  },
  [ModelName.EmailToken]: {
    name: ModelName.EmailToken,
    description: 'An email token for email verification or password reset',
    collection: ModelNameCollection.EmailToken,
    schema: EmailTokenSchema,
    path: modelNameCollectionToPath(ModelNameCollection.EmailToken),
  },
  [ModelName.Game]: {
    name: ModelName.Game,
    description: 'A game in the system.',
    collection: ModelNameCollection.Game,
    schema: GameSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Game),
  },
  [ModelName.User]: {
    name: ModelName.User,
    description: 'A user in the system.',
    collection: ModelNameCollection.User,
    schema: UserSchema,
    path: modelNameCollectionToPath(ModelNameCollection.User),
  },
};

export function getSchemaModel<T extends IBaseDocument<D>, D>(
  modelName: ModelName,
  connection: Connection,
  discriminatorCallback?: (model: Model<T>) => void,
): ISchemaModelData<T> {
  const value = Schema[modelName];
  const newModel = connection.model<T>(
    modelName,
    value.schema as MongooseSchema<T>,
    value.collection,
  );
  return {
    ...value,
    model: newModel,
    ...(discriminatorCallback
      ? { discriminators: discriminatorCallback(newModel) }
      : {}),
  };
}

/**
 * The schema for all models in the system.
 * This includes the name, description, plural name, and api name of each model.
 */
export function getSchemaMap(connection: Connection): SchemaMap {
  return {
    [ModelName.Action]: getSchemaModel<IActionDocument, IAction>(
      ModelName.Action,
      connection,
      (baseModel: Model<IActionDocument>) =>
        ActionDiscriminators<IActionDocument>(baseModel),
    ),
    [ModelName.Chef]: getSchemaModel<IChefDocument, IChef>(
      ModelName.Chef,
      connection,
    ),
    [ModelName.EmailToken]: getSchemaModel<IEmailTokenDocument, IEmailToken>(
      ModelName.EmailToken,
      connection,
    ),
    [ModelName.Game]: getSchemaModel<IGameDocument, IGame>(
      ModelName.Game,
      connection,
    ),
    [ModelName.User]: getSchemaModel<IUserDocument, IUser>(
      ModelName.User,
      connection,
    ),
  };
}
