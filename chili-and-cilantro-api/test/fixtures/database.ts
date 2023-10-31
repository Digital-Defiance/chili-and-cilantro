import { Model } from 'mongoose';
import { ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IDatabase } from "../../src/interfaces/database";

const mockUserFind = jest.fn();
const mockUserSave = jest.fn();
const mockUserCreate = jest.fn();

const UserMock = {
  create: mockUserCreate,
  find: mockUserFind,
  save: mockUserSave,
  // ...mock other methods you need
} as any; // Casting to any to bypass TypeScript checks, use specific type if available

export class MockDatabase implements IDatabase {
  getModel<T>(modelName: ModelName): Model<T> {
    switch (modelName) {
      case ModelName.User:
        return UserMock as Model<T>;
      // Add cases for other models
      default:
        throw new Error(`Mock for model ${modelName} not implemented`);
    }
  }
}