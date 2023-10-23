import { ModelName } from './enumerations/modelName';
import { ModelNameCollection } from './enumerations/modelNameCollection';
import { ActionSchema } from './schemas/action';
import { PlayerSchema } from './schemas/player';
import { UserSchema } from './schemas/user';
import { ISchemaModelData } from './interfaces/schemaModelData';
import { GameSchema } from './schemas/game';

function modelNameCollectionToPath(
  modelNameCollection: ModelNameCollection,
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
    description: 'An action taken by a player in a game.',
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
  Player: {
    name: ModelName.Player,
    description: 'A player in a game.',
    collection: ModelNameCollection.Player,
    schema: PlayerSchema,
    path: modelNameCollectionToPath(ModelNameCollection.Player),
  },
  User: {
    name: ModelName.User,
    description: 'A user in the system.',
    collection: ModelNameCollection.User,
    schema: UserSchema,
    path: modelNameCollectionToPath(ModelNameCollection.User),
  },
};
