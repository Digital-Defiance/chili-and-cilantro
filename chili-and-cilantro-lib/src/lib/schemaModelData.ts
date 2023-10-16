import { ModelName } from './enumerations/modelName';
import { ModelNameCollection } from './enumerations/modelNameCollection';
import { UserSchema } from './schemas/user';
import { ISchemaModelData } from './interfaces/schemaModelData';

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
  User: {
    name: ModelName.User,
    description: 'A user in the system.',
    collection: ModelNameCollection.User,
    schema: UserSchema,
    path: modelNameCollectionToPath(ModelNameCollection.User),
  },
};
