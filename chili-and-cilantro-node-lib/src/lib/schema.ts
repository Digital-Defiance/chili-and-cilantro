import {
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ActionDiscriminators } from './discriminators/action';
import { ISchemaModelData } from './interfaces/schema-model-data';
import { ActionModel } from './models/action';
import { ChefModel } from './models/chef';
import { GameModel } from './models/game';
import { UserModel } from './models/user';
import { ActionSchema } from './schemas/action';
import { ChefSchema } from './schemas/chef';
import { GameSchema } from './schemas/game';
import { UserSchema } from './schemas/user';

function modelNameCollectionToPath(
  modelNameCollection: ModelNameCollection,
): string {
  return `/${modelNameCollection as string}`;
}

/**
 * The schema for all models in the system.
 * This includes the name, description, plural name, and api name of each model.
 */
export const Schema: Record<ModelName, ISchemaModelData<any>> = {
  [ModelName.Action]: {
    name: ModelName.Action,
    description: 'An action taken by a chef in a game.',
    collection: ModelNameCollection.Action,
    model: ActionModel,
    schema: ActionSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Action),
    discriminators: ActionDiscriminators.discriminatorArray,
  },
  [ModelName.Chef]: {
    name: ModelName.Chef,
    description: 'A chef in a game.',
    collection: ModelNameCollection.Chef,
    model: ChefModel,
    schema: ChefSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Chef),
  },
  [ModelName.Game]: {
    name: ModelName.Game,
    description: 'A game in the system.',
    collection: ModelNameCollection.Game,
    model: GameModel,
    schema: GameSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Game),
  },
  [ModelName.User]: {
    name: ModelName.User,
    description: 'A user in the system.',
    collection: ModelNameCollection.User,
    model: UserModel,
    schema: UserSchema,
    path: modelNameCollectionToPath(ModelNameCollection.User),
  },
};
