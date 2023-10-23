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
import { IPlayer } from './interfaces/player';

export const SchemaModels: ISchemaModels = {
  Action: BaseModel.create<IAction>(ModelData[ModelName.Action]).Model,
  Game: BaseModel.create<IGame>(ModelData[ModelName.Game]).Model,
  Player: BaseModel.create<IPlayer>(ModelData[ModelName.Player]).Model,
  User: BaseModel.create<IUser>(ModelData[ModelName.User]).Model,
};
