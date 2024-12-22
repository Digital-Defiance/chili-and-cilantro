import { CardType } from '../enumerations/card-type';
import { StringLanguages } from '../enumerations/string-languages';

export type CardTypeTranslation = {
  [key in CardType]: string;
};
export type CardTypeLanguageTranslation = {
  [key in StringLanguages]: CardTypeTranslation;
};

export const CardTypeTranslations: CardTypeLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [CardType.Chili]: 'Chili',
    [CardType.Cilantro]: 'Cilantro',
  },
  [StringLanguages.EnglishUK]: {
    [CardType.Chili]: 'Chili',
    [CardType.Cilantro]: 'Cilantro',
  },
  [StringLanguages.French]: {
    [CardType.Chili]: 'Piment',
    [CardType.Cilantro]: 'Coriandre',
  },
  [StringLanguages.MandarinChinese]: {
    [CardType.Chili]: '辣椒',
    [CardType.Cilantro]: '芫荽',
  },
  [StringLanguages.Spanish]: {
    [CardType.Chili]: 'Chile',
    [CardType.Cilantro]: 'Cilantro',
  },
  [StringLanguages.Ukrainian]: {
    [CardType.Chili]: 'Чилі',
    [CardType.Cilantro]: 'Коріандр',
  },
};
