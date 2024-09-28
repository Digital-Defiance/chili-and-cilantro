import { ActionType } from '../enumerations/action-type';
import { StringLanguages } from '../enumerations/string-languages';

export type ActionTypeTranslation = {
  [key in ActionType]: string;
};
export type ActionTypeLanguageTranslation = {
  [key in StringLanguages]: ActionTypeTranslation;
};

export const ActionTypeTranslations: ActionTypeLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [ActionType.CREATE_GAME]: 'Create Game', // A chef creates a new game
    [ActionType.START_GAME]: 'Start Game', // A chef starts a game
    [ActionType.JOIN_GAME]: 'Join Game', // A chef joins a game
    [ActionType.END_GAME]: 'End Game', // A chef ends a game
    [ActionType.EXPIRE_GAME]: 'Expire Game', // A game ends because it has been inactive for too long
    [ActionType.PLACE_CARD]: 'Place Card', // Chefs place a card face down
    [ActionType.START_BIDDING]: 'Start Bidding', // A chef decides to start bidding instead of placing a card
    [ActionType.MAKE_BID]: 'Make Bid', // Chefs state how many cards they think they can flip without revealing a 'Chili'
    [ActionType.PASS]: 'Pass', // Chefs decide not to increase the bid and don't want to flip cards
    [ActionType.FLIP_CARD]: 'Flip Card', // The chef who won the bid flips a card
    [ActionType.END_ROUND]: 'End Round', // The round ends after the flip phase concludes, either by successful bid fulfillment or by revealing a 'Chili'
    [ActionType.START_NEW_ROUND]: 'Start New Round', // Chefs initiate a new round after the previous round concludes
    [ActionType.MESSAGE]: 'Message', // Optional: If chefs can chat or there are game announcements
    [ActionType.QUIT_GAME]: 'Quit Game', // A chef decides to leave the game
  },
  [StringLanguages.EnglishUK]: {
    [ActionType.CREATE_GAME]: 'Create Game',
    [ActionType.START_GAME]: 'Start Game',
    [ActionType.JOIN_GAME]: 'Join Game',
    [ActionType.END_GAME]: 'End Game',
    [ActionType.EXPIRE_GAME]: 'Expire Game',
    [ActionType.PLACE_CARD]: 'Place Card',
    [ActionType.START_BIDDING]: 'Start Bidding',
    [ActionType.MAKE_BID]: 'Make Bid',
    [ActionType.PASS]: 'Pass',
    [ActionType.FLIP_CARD]: 'Flip Card',
    [ActionType.END_ROUND]: 'End Round',
    [ActionType.START_NEW_ROUND]: 'Start New Round',
    [ActionType.MESSAGE]: 'Message',
    [ActionType.QUIT_GAME]: 'Quit Game',
  },
  [StringLanguages.French]: {
    [ActionType.CREATE_GAME]: 'Créer un jeu',
    [ActionType.START_GAME]: 'Démarrer le jeu',
    [ActionType.JOIN_GAME]: 'Rejoindre le jeu',
    [ActionType.END_GAME]: 'Terminer le jeu',
    [ActionType.EXPIRE_GAME]: 'Le jeu expire',
    [ActionType.PLACE_CARD]: 'Placer une carte',
    [ActionType.START_BIDDING]: 'Commencer les enchères',
    [ActionType.MAKE_BID]: 'Faire une offre',
    [ActionType.PASS]: 'Passer',
    [ActionType.FLIP_CARD]: 'Retourner la carte',
    [ActionType.END_ROUND]: 'Terminer le tour',
    [ActionType.START_NEW_ROUND]: 'Commencer un nouveau tour',
    [ActionType.MESSAGE]: 'Message',
    [ActionType.QUIT_GAME]: 'Quitter le jeu',
  },
  [StringLanguages.MandarinChinese]: {
    [ActionType.CREATE_GAME]: '创建游戏',
    [ActionType.START_GAME]: '开始游戏',
    [ActionType.JOIN_GAME]: '加入游戏',
    [ActionType.END_GAME]: '结束游戏',
    [ActionType.EXPIRE_GAME]: '游戏到期',
    [ActionType.PLACE_CARD]: '放置卡片',
    [ActionType.START_BIDDING]: '开始竞标',
    [ActionType.MAKE_BID]: '出价',
    [ActionType.PASS]: '通过',
    [ActionType.FLIP_CARD]: '翻牌',
    [ActionType.END_ROUND]: '结束回合',
    [ActionType.START_NEW_ROUND]: '开始新回合',
    [ActionType.MESSAGE]: '消息',
    [ActionType.QUIT_GAME]: '退出游戏',
  },
  [StringLanguages.Spanish]: {
    [ActionType.CREATE_GAME]: 'Crear juego',
    [ActionType.START_GAME]: 'Comenzar juego',
    [ActionType.JOIN_GAME]: 'Unirse al juego',
    [ActionType.END_GAME]: 'Terminar juego',
    [ActionType.EXPIRE_GAME]: 'Juego caducado',
    [ActionType.PLACE_CARD]: 'Colocar carta',
    [ActionType.START_BIDDING]: 'Comenzar subasta',
    [ActionType.MAKE_BID]: 'Hacer oferta',
    [ActionType.PASS]: 'Pasar',
    [ActionType.FLIP_CARD]: 'Voltear carta',
    [ActionType.END_ROUND]: 'Terminar ronda',
    [ActionType.START_NEW_ROUND]: 'Comenzar nueva ronda',
    [ActionType.MESSAGE]: 'Mensaje',
    [ActionType.QUIT_GAME]: 'Salir del juego',
  },
  [StringLanguages.Ukrainian]: {
    [ActionType.CREATE_GAME]: 'Створити гру',
    [ActionType.START_GAME]: 'Почати гру',
    [ActionType.JOIN_GAME]: 'Приєднатися до гри',
    [ActionType.END_GAME]: 'Завершити гру',
    [ActionType.EXPIRE_GAME]: 'Гра закінчується',
    [ActionType.PLACE_CARD]: 'Покласти карту',
    [ActionType.START_BIDDING]: 'Почати торги',
    [ActionType.MAKE_BID]: 'Зробити ставку',
    [ActionType.PASS]: 'Пройти',
    [ActionType.FLIP_CARD]: 'Перевернути карту',
    [ActionType.END_ROUND]: 'Завершити раунд',
    [ActionType.START_NEW_ROUND]: 'Почати новий раунд',
    [ActionType.MESSAGE]: 'Повідомлення',
    [ActionType.QUIT_GAME]: 'Вийти з гри',
  },
};
