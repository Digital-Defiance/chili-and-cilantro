import { GamePhase } from '../enumerations/game-phase';
import { StringLanguages } from '../enumerations/string-languages';

export type GamePhaseTranslation = {
  [key in GamePhase]: string;
};
export type GamePhaseLanguageTranslation = {
  [key in StringLanguages]: GamePhaseTranslation;
};

export const GamePhaseTranslations: GamePhaseLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [GamePhase.BIDDING]: 'Bidding',
    [GamePhase.GAME_OVER]: 'Game Over',
    [GamePhase.LOBBY]: 'Lobby',
    [GamePhase.RESOLUTION]: 'Resolution',
    [GamePhase.REVEAL]: 'Reveal',
    [GamePhase.ROUND_END]: 'Round End',
    [GamePhase.ROUND_START]: 'Round Start',
    [GamePhase.SETUP]: 'Setup',
  },
  [StringLanguages.EnglishUK]: {
    [GamePhase.BIDDING]: 'Bidding',
    [GamePhase.GAME_OVER]: 'Game Over',
    [GamePhase.LOBBY]: 'Lobby',
    [GamePhase.RESOLUTION]: 'Resolution',
    [GamePhase.REVEAL]: 'Reveal',
    [GamePhase.ROUND_END]: 'Round End',
    [GamePhase.ROUND_START]: 'Round Start',
    [GamePhase.SETUP]: 'Setup',
  },
  [StringLanguages.French]: {
    [GamePhase.BIDDING]: 'Enchères',
    [GamePhase.GAME_OVER]: 'Fin de partie',
    [GamePhase.LOBBY]: 'Hall',
    [GamePhase.RESOLUTION]: 'Résolution',
    [GamePhase.REVEAL]: 'Révéler',
    [GamePhase.ROUND_END]: 'Fin de tour',
    [GamePhase.ROUND_START]: 'Début de tour',
    [GamePhase.SETUP]: 'Configuration',
  },
  [StringLanguages.MandarinChinese]: {
    [GamePhase.BIDDING]: '竞标',
    [GamePhase.GAME_OVER]: '游戏结束',
    [GamePhase.LOBBY]: '大厅',
    [GamePhase.RESOLUTION]: '解析',
    [GamePhase.REVEAL]: '揭示',
    [GamePhase.ROUND_END]: '回合结束',
    [GamePhase.ROUND_START]: '回合开始',
    [GamePhase.SETUP]: '设置',
  },
  [StringLanguages.Spanish]: {
    [GamePhase.BIDDING]: 'Oferta',
    [GamePhase.GAME_OVER]: 'Fin del juego',
    [GamePhase.LOBBY]: 'Sala',
    [GamePhase.RESOLUTION]: 'Resolución',
    [GamePhase.REVEAL]: 'Revelar',
    [GamePhase.ROUND_END]: 'Fin de ronda',
    [GamePhase.ROUND_START]: 'Inicio de ronda',
    [GamePhase.SETUP]: 'Configuración',
  },
  [StringLanguages.Ukrainian]: {
    [GamePhase.BIDDING]: 'Торги',
    [GamePhase.GAME_OVER]: 'Кінець гри',
    [GamePhase.LOBBY]: 'Фойє',
    [GamePhase.RESOLUTION]: 'Рішення',
    [GamePhase.REVEAL]: 'Розкриття',
    [GamePhase.ROUND_END]: 'Кінець раунду',
    [GamePhase.ROUND_START]: 'Початок раунду',
    [GamePhase.SETUP]: 'Налаштування',
  },
};
