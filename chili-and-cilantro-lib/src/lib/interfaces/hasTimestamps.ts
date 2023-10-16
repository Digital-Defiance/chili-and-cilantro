import { IHasCreation } from './hasCreation';

export interface IHasTimestamps extends IHasCreation {
  createdAt: Date;
  updatedAt: Date;
}
