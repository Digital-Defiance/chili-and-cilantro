import { DefaultIdType } from '../../shared-types';
import { IChef } from '../models/chef';
import { IBaseDocument } from './base';

export interface IChefDocument<I = DefaultIdType>
  extends IBaseDocument<IChef, I>,
    IChef {}
