import { IActionDocument } from './documents/action';
import { IChefDocument } from './documents/chef';
import { IGameDocument } from './documents/game';
import { IGameChefs } from './game-chefs';
import { IActionObject } from './objects/action';
import { IChefObject } from './objects/chef';
import { IGameObject } from './objects/game';

export interface IGameChefsHistory<
  TGame extends IGameDocument | IGameObject = IGameDocument,
  TChef extends IChefDocument | IChefObject = IChefDocument,
  TAction extends IActionDocument | IActionObject = IActionDocument,
> extends IGameChefs<TGame, TChef> {
  history: TAction[];
}
