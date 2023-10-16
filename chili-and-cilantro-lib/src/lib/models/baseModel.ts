import { model, Model, Schema } from 'mongoose';
import { IHasID } from '../interfaces/hasId';
import { IModelData } from '../interfaces/modelData';
import ModelName from '../enumerations/modelName';

abstract class Base {
  protected static readonly ModelRegistry: Map<string, Model<unknown>> =
    new Map<string, Model<unknown>>();
  constructor(model: Model<unknown>) {
    if (!model || !model.modelName) {
      return;
    }
    if (Base.ModelRegistry.has(model.modelName)) {
      throw new Error(`Model ${model.modelName} already exists`);
    }
    Base.ModelRegistry.set(model.modelName, model);
  }
  public static getModel<T>(model: ModelName): Model<T> {
    if (!Base.ModelRegistry.has(model)) {
      throw new Error(`Model ${model} does not exist`);
    }
    return Base.ModelRegistry.get(model) as Model<T>;
  }
}

export class BaseModel<
  T extends IHasID<U>,
  U = Schema.Types.ObjectId,
> extends Base {
  protected static ModelDataMap: Map<string, IModelData> = new Map<
    string,
    IModelData
  >();
  public readonly Name: ModelName;
  public readonly Path: string;
  public readonly Schema: Schema;
  public readonly Collection?: string;
  public readonly Model: Model<T>;
  constructor(modelData: IModelData, model: Model<T>) {
    super(model as Model<unknown>);
    this.Name = modelData.name;
    this.Path = modelData.path;
    this.Schema = modelData.schema;
    this.Collection = modelData.collection;
    this.Model = model;
    BaseModel.ModelDataMap.set(modelData.name, modelData);
  }
  static create<T extends IHasID>(modelData: IModelData): BaseModel<T> {
    const newModel = model<T>(
      modelData.name,
      modelData.schema,
      modelData.collection,
    );
    const baseModel = new BaseModel<T>(modelData, newModel);
    return baseModel;
  }
  static getModelData(model: ModelName): IModelData {
    if (!BaseModel.ModelDataMap.has(model)) {
      throw new Error(`Model ${model} does not exist`);
    }
    return BaseModel.ModelDataMap.get(model) as IModelData;
  }
}
