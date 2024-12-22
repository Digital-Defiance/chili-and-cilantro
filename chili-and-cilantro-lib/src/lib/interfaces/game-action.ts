import { IStartGameActionDocument } from './documents/actions/start-game';
import { IGameDocument } from './documents/game';

export interface IGameAction<
  TGame = IGameDocument,
  TAction = IStartGameActionDocument,
> {
  game: TGame;
  action: TAction;
}
