import { QuitGameReason } from '../enumerations/quit-game-reason';
import { StringLanguages } from '../enumerations/string-languages';

export type QuitGameReasonTranslation = {
  [key in QuitGameReason]: string;
};
export type QuitGameReasonLanguageTranslation = {
  [key in StringLanguages]: QuitGameReasonTranslation;
};

export const QuitGameReasonTranslations: QuitGameReasonLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [QuitGameReason.DISCONNECTED]: 'Disconnected',
    [QuitGameReason.LEFT_GAME]: 'Left Game',
    [QuitGameReason.TIMEOUT]: 'Timeout',
  },
  [StringLanguages.EnglishUK]: {
    [QuitGameReason.DISCONNECTED]: 'Disconnected',
    [QuitGameReason.LEFT_GAME]: 'Left Game',
    [QuitGameReason.TIMEOUT]: 'Timeout',
  },
  [StringLanguages.French]: {
    [QuitGameReason.DISCONNECTED]: 'Déconnecté',
    [QuitGameReason.LEFT_GAME]: 'Parti du jeu',
    [QuitGameReason.TIMEOUT]: 'Temps écoulé',
  },
  [StringLanguages.MandarinChinese]: {
    [QuitGameReason.DISCONNECTED]: '断开',
    [QuitGameReason.LEFT_GAME]: '离开游戏',
    [QuitGameReason.TIMEOUT]: '超时',
  },
  [StringLanguages.Spanish]: {
    [QuitGameReason.DISCONNECTED]: 'Desconectado',
    [QuitGameReason.LEFT_GAME]: 'Salió del juego',
    [QuitGameReason.TIMEOUT]: 'Tiempo de espera',
  },
  [StringLanguages.Ukrainian]: {
    [QuitGameReason.DISCONNECTED]: 'Відключено',
    [QuitGameReason.LEFT_GAME]: 'Покинув гру',
    [QuitGameReason.TIMEOUT]: 'Тайм-аут',
  },
};
