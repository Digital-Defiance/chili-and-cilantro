import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  getSchemaMap,
  IApplication,
  SchemaMap,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import mongoose from 'mongoose';
import { getModel as mockGetModel } from '../../src/mocks/models/get-model';

export class MockApplication implements IApplication {
  public get db(): typeof mongoose {
    return mongoose;
  }
  private _schemaMap: SchemaMap | undefined;
  public get schemaMap(): SchemaMap {
    return this._schemaMap;
  }
  public get ready(): boolean {
    return true;
  }
  public get useTransactions(): boolean {
    return true;
  }
  public getModel: GetModelFunction = mockGetModel;
  public start(mongoUri?: string): Promise<void> {
    this._schemaMap = getSchemaMap(this.db.connection);
    return Promise.resolve();
  }
}
