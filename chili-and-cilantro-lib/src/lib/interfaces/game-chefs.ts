import { IChefDocument } from './documents/chef';
import { IGameDocument } from './documents/game';
import { IChefObject } from './objects/chef';
import { IGameObject } from './objects/game';

export interface IGameChefs<
  TGame extends IGameDocument | IGameObject = IGameDocument,
  TChef extends IChefDocument | IChefObject = IChefDocument,
> {
  game: TGame;
  chefs: TChef[];
}
