import { IHasCreation } from './has-creation';

export interface IHasTimestamps extends IHasCreation {
  createdAt: Date;
  updatedAt: Date;
}
