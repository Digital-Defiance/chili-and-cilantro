import {
  GetModelFunction,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ActionModel,
  ChefModel,
  EmailTokenModel,
  GameModel,
  IApplication,
  SchemaMap,
  UserModel,
  getSchemaMap,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import mongoose, { Connection, Model, createConnection } from 'mongoose';

export class MockApplication implements IApplication {
  private readonly mockConnection: Connection = createConnection();
  private readonly getModelTable: { [key in ModelName]: Model<any> } = {
    [ModelName.User]: UserModel(this.mockConnection),
    [ModelName.Chef]: ChefModel(this.mockConnection),
    [ModelName.EmailToken]: EmailTokenModel(this.mockConnection),
    [ModelName.Action]: ActionModel(this.mockConnection),
    [ModelName.Game]: GameModel(this.mockConnection),
  };

  public get db(): typeof mongoose {
    const mongooseMock = { ...mongoose, connection: this.mockConnection };
    return mongooseMock;
  }
  private _schemaMap: SchemaMap | undefined = getSchemaMap(this.mockConnection);
  public get schemaMap(): SchemaMap {
    return this._schemaMap;
  }
  public get ready(): boolean {
    return true;
  }
  public get useTransactions(): boolean {
    return true;
  }
  public getModel: GetModelFunction = <T>(modelName: ModelName) => {
    return this.getModelTable[modelName] as Model<T>;
  };
  public start(mongoUri?: string): Promise<void> {
    return Promise.resolve();
  }
}
