import { DefaultIdType } from '../shared-types';
import { IHasCreator } from './has-creator';
import { IHasUpdater } from './has-updater';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasTimestampOwners<I = DefaultIdType>
  extends IHasCreator<I>,
    IHasUpdater<I> {}
