// file: schema.ts
// description: This file contains the schema for all models in the system
// ---------------------------------------------------------------------------------------------
import { ModelName } from './enumerations/modelName';
import { IUser } from './interfaces/user';
import { BaseModel } from './models/baseModel';
import { ISchemaModels } from './interfaces/schemaModels';
import { ModelData } from './schemaModelData';
import { IGame } from './interfaces/game';
import { IAction } from './interfaces/action';
import { IChef } from './interfaces/chef';

export const SchemaModels: ISchemaModels = {
  Action: BaseModel.create<IAction>(ModelData[ModelName.Action]).Model,
  Chef: BaseModel.create<IChef>(ModelData[ModelName.Chef]).Model,
  Game: BaseModel.create<IGame>(ModelData[ModelName.Game]).Model,
  User: BaseModel.create<IUser>(ModelData[ModelName.User]).Model,
};
