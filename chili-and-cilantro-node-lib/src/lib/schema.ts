import {
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { ActionDiscriminators } from './discriminators/action';
import { ISchemaData } from './interfaces/schema-data';
import { ActionSchema } from './schemas/action';
import { ChefSchema } from './schemas/chef';
import { EmailTokenSchema } from './schemas/email-token';
import { GameSchema } from './schemas/game';
import { UserSchema } from './schemas/user';
import { ChiliCilantroDocuments, SchemaMap } from './types/types';

function modelNameCollectionToPath(
  modelNameCollection: ModelNameCollection,
): string {
  return `/${modelNameCollection as string}`;
}

export const Schema: Record<ModelName, ISchemaData<any>> = {
  [ModelName.Action]: {
    name: ModelName.Action,
    description: 'An action taken by a chef in a game.',
    collection: ModelNameCollection.Action,
    schema: ActionSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Action),
    discriminators: ActionDiscriminators.discriminatorArray,
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

/**
 * The schema for all models in the system.
 * This includes the name, description, plural name, and api name of each model.
 */
export function getSchemaMap<T extends ChiliCilantroDocuments>(
  connection: Connection,
): SchemaMap {
  return Object.entries(Schema).reduce((acc, [key, value]) => {
    const modelName = key as ModelName;
    acc[modelName] = {
      ...value,
      model: connection.model<T>(
        modelName,
        value.schema as MongooseSchema<T>,
        value.collection,
      ),
    };
    return acc;
  }, {} as SchemaMap);
}
