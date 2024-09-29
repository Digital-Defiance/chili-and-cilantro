import { IBaseDocument } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Model } from 'mongoose';

export interface IDiscriminatorCollections<T extends IBaseDocument<any>> {
  byType: Record<string, Model<T>>;
  array: Array<Model<T>>;
}
