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
    [CardType.CHILI]: 'Chili',
    [CardType.CILANTRO]: 'Cilantro',
  },
  [StringLanguages.EnglishUK]: {
    [CardType.CHILI]: 'Chili',
    [CardType.CILANTRO]: 'Cilantro',
  },
  [StringLanguages.French]: {
    [CardType.CHILI]: 'Piment',
    [CardType.CILANTRO]: 'Coriandre',
  },
  [StringLanguages.MandarinChinese]: {
    [CardType.CHILI]: '辣椒',
    [CardType.CILANTRO]: '芫荽',
  },
  [StringLanguages.Spanish]: {
    [CardType.CHILI]: 'Chile',
    [CardType.CILANTRO]: 'Cilantro',
  },
  [StringLanguages.Ukrainian]: {
    [CardType.CHILI]: 'Чилі',
    [CardType.CILANTRO]: 'Коріандр',
  },
};
