import { IBaseDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Model } from 'mongoose';
import { ISchemaData } from './schema-data';

export interface ISchemaModelData<T extends IBaseDocument<any>>
  extends ISchemaData<T> {
  model: Model<T>;
}
