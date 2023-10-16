import { IHasCreator } from './hasCreator';
import { IHasUpdater } from './hasUpdater';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IHasTimestampOwners extends IHasCreator, IHasUpdater {}
