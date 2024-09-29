import { StringLanguages } from '../enumerations/string-languages';
import { TurnAction } from '../enumerations/turn-action';

export type TurnActionTranslation = {
  [key in TurnAction]: string;
};
export type TurnActionLanguageTranslation = {
  [key in StringLanguages]: TurnActionTranslation;
};

export const TurnActionTranslations: TurnActionLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [TurnAction.Bid]: 'Bid',
    [TurnAction.IncreaseBid]: 'Increase Bid',
    [TurnAction.Pass]: 'Pass',
    [TurnAction.PlaceCard]: 'Place Card',
  },
  [StringLanguages.EnglishUK]: {
    [TurnAction.Bid]: 'Bid',
    [TurnAction.IncreaseBid]: 'Increase Bid',
    [TurnAction.Pass]: 'Pass',
    [TurnAction.PlaceCard]: 'Place Card',
  },
  [StringLanguages.French]: {
    [TurnAction.Bid]: 'Enchère',
    [TurnAction.IncreaseBid]: "Augmenter l'enchère",
    [TurnAction.Pass]: 'Passer',
    [TurnAction.PlaceCard]: 'Placer la carte',
  },
  [StringLanguages.MandarinChinese]: {
    [TurnAction.Bid]: '出价',
    [TurnAction.IncreaseBid]: '增加出价',
    [TurnAction.Pass]: '通过',
    [TurnAction.PlaceCard]: '放置卡',
  },
  [StringLanguages.Spanish]: {
    [TurnAction.Bid]: 'Oferta',
    [TurnAction.IncreaseBid]: 'Aumentar la oferta',
    [TurnAction.Pass]: 'Pasar',
    [TurnAction.PlaceCard]: 'Colocar tarjeta',
  },
  [StringLanguages.Ukrainian]: {
    [TurnAction.Bid]: 'Пропозиція',
    [TurnAction.IncreaseBid]: 'Збільшити пропозицію',
    [TurnAction.Pass]: 'Пройти',
    [TurnAction.PlaceCard]: 'Покласти карту',
  },
};
