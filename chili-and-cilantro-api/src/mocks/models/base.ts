import {
  IBaseDocument,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Model } from 'mongoose';

export type MockedQuery<T> = {
  sort: jest.Mock<MockedQuery<T>, [Record<string, 1 | -1>]>;
  exec: jest.Mock<Promise<T[]>>;
};

type ModelConstructor<T> = new (data: Partial<T>) => T;

export type BaseMockedModel<
  T extends IBaseDocument<D>,
  D = any,
> = jest.MockedClass<ModelConstructor<T>> & {
  create: jest.MockedFunction<(data: Partial<T>) => Promise<T>>;
  findById: jest.MockedFunction<(id: string) => MockedQuery<T | null>>;
  find: jest.MockedFunction<
    (conditions: Record<string, any>) => MockedQuery<T>
  >;
  findOne: jest.MockedFunction<
    (conditions: Record<string, any>) => MockedQuery<T | null>
  >;
  updateOne: jest.MockedFunction<
    (
      conditions: Record<string, any>,
      update: Partial<T>,
    ) => Promise<{ nModified: number }>
  >;
  deleteOne: jest.MockedFunction<
    (conditions: Record<string, any>) => Promise<{ deletedCount: number }>
  >;
  discriminator: jest.MockedFunction<
    (name: string, schema: any) => Model<Document>
  >;
  sort: jest.MockedFunction<(...args: any[]) => MockedQuery<T>>;
};

export function createBaseMockedModel<T extends IBaseDocument<D>, D = any>(
  modelName: ModelName,
): BaseMockedModel<T, D> {
  const mockQuery = {
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  } as unknown as MockedQuery<T>;

  const MockModelClass = jest.fn() as unknown as jest.MockedClass<
    ModelConstructor<T>
  >;

  Object.assign(MockModelClass, {
    create: jest
      .fn()
      .mockImplementation((data: Partial<T>) =>
        Promise.resolve({ ...data, _id: 'mock-id' } as T),
      ),
    findById: jest.fn().mockReturnValue(mockQuery),
    find: jest.fn().mockReturnValue(mockQuery),
    findOne: jest.fn().mockReturnValue(mockQuery),
    updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    discriminator: jest.fn(),
    sort: jest.fn().mockReturnValue(mockQuery),
  });

  return MockModelClass as BaseMockedModel<T, D>;
}
