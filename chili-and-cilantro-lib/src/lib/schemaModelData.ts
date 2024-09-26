import { ModelName } from './enumerations/modelName';
import { ModelNameCollection } from './enumerations/modelNameCollection';
import { ActionSchema } from './schemas/action';
import { ChefSchema } from './schemas/chef';
import { UserSchema } from './schemas/user';
import { ISchemaModelData } from './interfaces/schemaModelData';
import { GameSchema } from './schemas/game';

function modelNameCollectionToPath(
  modelNameCollection: ModelNameCollection
): string {
  return `/${modelNameCollection as string}`;
}

/**
 * The schema for all models in the system.
 * This includes the name, description, plural name, and api name of each model.
 */
export const ModelData: ISchemaModelData = {
  Action: {
    name: ModelName.Action,
    description: 'An action taken by a chef in a game.',
    collection: ModelNameCollection.Action,
    schema: ActionSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Action),
  },
  Game: {
    name: ModelName.Game,
    description: 'A game in the system.',
    collection: ModelNameCollection.Game,
    schema: GameSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Game),
  },
  Chef: {
    name: ModelName.Chef,
    description: 'A chef in a game.',
    collection: ModelNameCollection.Chef,
    schema: ChefSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Chef),
  },
  User: {
    name: ModelName.User,
    description: 'A user in the system.',
    collection: ModelNameCollection.User,
    schema: UserSchema,
    path: modelNameCollectionToPath(ModelNameCollection.User),
  },
};
