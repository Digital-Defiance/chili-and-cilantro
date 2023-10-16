/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { model, Model, Schema } from 'mongoose';
import { BaseModel } from './baseModel';
import ModelName from '../enumerations/modelName';
import ModelNameCollection from '../enumerations/modelNameCollection';
import { IUser } from '../interfaces/user';
import { IPost } from '../interfaces/post';
import { Mode } from 'fs';

describe('BaseModel', () => {
  it('should be able to create a new model', () => {
    const modelName: ModelName = ModelName.User;
    const schema = new Schema();
    const newModel = BaseModel.create<IUser>({
      name: modelName,
      description: 'test',
      collection: ModelNameCollection.User,
      schema: schema,
      path: `/${ModelNameCollection.User}}`,
    });
    expect(newModel).toBeDefined();
    expect(newModel.Model).toBeTruthy();
    const retrievedModel = BaseModel.getModel(modelName);
    expect(retrievedModel).toBe(newModel.Model);
    expect(retrievedModel.modelName).toBe(modelName);
  });
  it('should not allow the same model to be added twice', () => {
    const schema1 = new Schema();
    const schema2 = new Schema();
    const newModel1 = BaseModel.create<IUser>({
      name: ModelName.User,
      description: 'test1',
      collection: ModelNameCollection.User,
      schema: schema1,
      path: `/${ModelNameCollection.User}}`,
    });
    const newModel2 = BaseModel.create<IPost>({
      name: ModelName.Post,
      description: 'test2',
      collection: ModelNameCollection.Post,
      schema: schema2,
      path: `/${ModelNameCollection.Post}}`,
    });
    const schema3 = new Schema();
    expect(() =>
      BaseModel.create<IUser>({
        name: ModelName.User,
        description: 'test1 duplicate',
        collection: ModelNameCollection.User,
        schema: schema3,
        path: `/${ModelNameCollection.User}}`,
      }),
    ).toThrowError('Cannot overwrite `test1` model once compiled.');
  });
});
