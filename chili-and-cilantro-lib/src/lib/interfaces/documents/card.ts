import { DefaultIdType } from '../../shared-types';
import { ICard } from '../card';
import { IBaseDocument } from './base';

export interface ICardDocument<I = DefaultIdType>
  extends IBaseDocument<ICard, I>,
    ICard {}
