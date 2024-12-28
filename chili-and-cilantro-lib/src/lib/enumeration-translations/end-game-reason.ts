import { EndGameReason } from '../enumerations/end-game-reason';
import { StringLanguages } from '../enumerations/string-languages';

export type EndGameReasonTranslation = {
  [key in EndGameReason]: string;
};
export type EndGameReasonLanguageTranslation = {
  [key in StringLanguages]: EndGameReasonTranslation;
};

export const EndGameReasonTranslations: EndGameReasonLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [EndGameReason.ENDED_BY_HOST]: 'Ended by Host',
    [EndGameReason.GAME_OVER]: 'Game Over',
    [EndGameReason.INACTIVE]: 'Inactive',
  },
  [StringLanguages.EnglishUK]: {
    [EndGameReason.ENDED_BY_HOST]: 'Ended by Host',
    [EndGameReason.GAME_OVER]: 'Game Over',
    [EndGameReason.INACTIVE]: 'Inactive',
  },
  [StringLanguages.French]: {
    [EndGameReason.ENDED_BY_HOST]: "Terminé par l'hôte",
    [EndGameReason.GAME_OVER]: 'Fin de partie',
    [EndGameReason.INACTIVE]: 'Inactif',
  },
  [StringLanguages.MandarinChinese]: {
    [EndGameReason.ENDED_BY_HOST]: '主持人结束',
    [EndGameReason.GAME_OVER]: '游戏结束',
    [EndGameReason.INACTIVE]: '不活跃',
  },
  [StringLanguages.Spanish]: {
    [EndGameReason.ENDED_BY_HOST]: 'Terminado por el anfitrión',
    [EndGameReason.GAME_OVER]: 'Fin del juego',
    [EndGameReason.INACTIVE]: 'Inactivo',
  },
  [StringLanguages.Ukrainian]: {
    [EndGameReason.ENDED_BY_HOST]: 'Закінчено господарем',
    [EndGameReason.GAME_OVER]: 'Гра закінчилася',
    [EndGameReason.INACTIVE]: 'Неактивний',
  },
};
