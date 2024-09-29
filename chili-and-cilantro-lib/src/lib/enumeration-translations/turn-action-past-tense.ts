import { StringLanguages } from '../enumerations/string-languages';
import { TurnAction } from '../enumerations/turn-action';
import { TurnActionLanguageTranslation } from './turn-action';

export const TurnActionPastTenseTranslations: TurnActionLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [TurnAction.Bid]: 'Made a Bid',
    [TurnAction.IncreaseBid]: 'Increased Bid',
    [TurnAction.Pass]: 'Passed',
    [TurnAction.PlaceCard]: 'Placed Card',
  },
  [StringLanguages.EnglishUK]: {
    [TurnAction.Bid]: 'Made a Bid',
    [TurnAction.IncreaseBid]: 'Increased Bid',
    [TurnAction.Pass]: 'Passed',
    [TurnAction.PlaceCard]: 'Placed Card',
  },
  [StringLanguages.French]: {
    [TurnAction.Bid]: 'Fait une offre',
    [TurnAction.IncreaseBid]: "Augmenté l'offre",
    [TurnAction.Pass]: 'Passé',
    [TurnAction.PlaceCard]: 'Placé la carte',
  },
  [StringLanguages.MandarinChinese]: {
    [TurnAction.Bid]: '出价',
    [TurnAction.IncreaseBid]: '增加出价',
    [TurnAction.Pass]: '通过',
    [TurnAction.PlaceCard]: '放置卡',
  },
  [StringLanguages.Spanish]: {
    [TurnAction.Bid]: 'Hizo una oferta',
    [TurnAction.IncreaseBid]: 'Aumentó la oferta',
    [TurnAction.Pass]: 'Pasó',
    [TurnAction.PlaceCard]: 'Colocó tarjeta',
  },
  [StringLanguages.Ukrainian]: {
    [TurnAction.Bid]: 'Зробив пропозицію',
    [TurnAction.IncreaseBid]: 'Збільшив пропозицію',
    [TurnAction.Pass]: 'Пройшов',
    [TurnAction.PlaceCard]: 'Поклав карту',
  },
};
