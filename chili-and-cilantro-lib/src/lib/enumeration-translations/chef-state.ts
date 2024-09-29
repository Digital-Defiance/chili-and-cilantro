import { ChefState } from '../enumerations/chef-state';
import { StringLanguages } from '../enumerations/string-languages';

export type ChefStateTranslation = {
  [key in ChefState]: string;
};
export type ChefStateLanguageTranslation = {
  [key in StringLanguages]: ChefStateTranslation;
};

export const ChefStateTranslations: ChefStateLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [ChefState.DISCONNECTED]: 'Disconnected',
    [ChefState.ELIMINATED]: 'Eliminated',
    [ChefState.EXPIRED]: 'Expired',
    [ChefState.LOBBY]: 'Lobby',
    [ChefState.PLAYING]: 'Playing',
    [ChefState.QUIT]: 'Quit',
  },
  [StringLanguages.EnglishUK]: {
    [ChefState.DISCONNECTED]: 'Disconnected',
    [ChefState.ELIMINATED]: 'Eliminated',
    [ChefState.EXPIRED]: 'Expired',
    [ChefState.LOBBY]: 'Lobby',
    [ChefState.PLAYING]: 'Playing',
    [ChefState.QUIT]: 'Quit',
  },
  [StringLanguages.French]: {
    [ChefState.DISCONNECTED]: 'Déconnecté',
    [ChefState.ELIMINATED]: 'Éliminé',
    [ChefState.EXPIRED]: 'Expiré',
    [ChefState.LOBBY]: 'Hall',
    [ChefState.PLAYING]: 'Jouer',
    [ChefState.QUIT]: 'Quitter',
  },
  [StringLanguages.MandarinChinese]: {
    [ChefState.DISCONNECTED]: '断开',
    [ChefState.ELIMINATED]: '淘汰',
    [ChefState.EXPIRED]: '过期',
    [ChefState.LOBBY]: '大厅',
    [ChefState.PLAYING]: '玩',
    [ChefState.QUIT]: '退出',
  },
  [StringLanguages.Spanish]: {
    [ChefState.DISCONNECTED]: 'Desconectado',
    [ChefState.ELIMINATED]: 'Eliminado',
    [ChefState.EXPIRED]: 'Caducado',
    [ChefState.LOBBY]: 'Sala',
    [ChefState.PLAYING]: 'Jugar',
    [ChefState.QUIT]: 'Dejar',
  },
  [StringLanguages.Ukrainian]: {
    [ChefState.DISCONNECTED]: 'Відключено',
    [ChefState.ELIMINATED]: 'Вилучено',
    [ChefState.EXPIRED]: 'Закінчився',
    [ChefState.LOBBY]: 'Лобі',
    [ChefState.PLAYING]: 'Грати',
    [ChefState.QUIT]: 'Покинути',
  },
};
