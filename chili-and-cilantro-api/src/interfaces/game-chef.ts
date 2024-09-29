import {
  IChefDocument,
  IGameDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';

export interface IGameChef {
  game: IGameDocument;
  chef: IChefDocument;
}
