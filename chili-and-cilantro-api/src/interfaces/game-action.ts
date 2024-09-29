import {
  IGameDocument,
  IStartGameActionDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';

export interface IGameAction {
  game: IGameDocument;
  action: IStartGameActionDocument;
}
