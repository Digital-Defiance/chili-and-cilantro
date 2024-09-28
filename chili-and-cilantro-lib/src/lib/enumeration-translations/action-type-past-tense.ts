import { ActionType } from '../enumerations/action-type';
import { StringLanguages } from '../enumerations/string-languages';
import { ActionTypeLanguageTranslation } from './action-type';

export const ActionTypePastTenseTranslations: ActionTypeLanguageTranslation = {
  [StringLanguages.EnglishUS]: {
    [ActionType.CREATE_GAME]: 'Created Game', // A chef created a new game
    [ActionType.START_GAME]: 'Started Game', // A chef started a game
    [ActionType.JOIN_GAME]: 'Joined Game', // A chef joined a game
    [ActionType.END_GAME]: 'Ended Game', // A chef ended a game
    [ActionType.EXPIRE_GAME]: 'Expired Game', // A game ended because it has been inactive for too long
    [ActionType.PLACE_CARD]: 'Placed Card', // Chef placed a card face down
    [ActionType.START_BIDDING]: 'Started Bidding', // A chef decided to start bidding instead of placing a card
    [ActionType.MAKE_BID]: 'Made a Bid', // Chef stated how many cards they think they can flip without revealing a 'Chili'
    [ActionType.PASS]: 'Passed', // Chef decided not to increase the bid and don't want to flip cards
    [ActionType.FLIP_CARD]: 'Flipped Card', // The chef who won the bid flipped a card
    [ActionType.END_ROUND]: 'Ended Round', // The round ended after the flip phase concludes, either by successful bid fulfillment or by revealing a 'Chili'
    [ActionType.START_NEW_ROUND]: 'Started New Round', // Chef initiated a new round after the previous round concludes
    [ActionType.MESSAGE]: 'Sent a Message', // A message from a chef or a game announcement
    [ActionType.QUIT_GAME]: 'Quit Game', // A chef decided to leave the game
  },
  [StringLanguages.EnglishUK]: {
    [ActionType.CREATE_GAME]: 'Created Game',
    [ActionType.START_GAME]: 'Started Game',
    [ActionType.JOIN_GAME]: 'Joined Game',
    [ActionType.END_GAME]: 'Ended Game',
    [ActionType.EXPIRE_GAME]: 'Expired Game',
    [ActionType.PLACE_CARD]: 'Placed Card',
    [ActionType.START_BIDDING]: 'Started Bidding',
    [ActionType.MAKE_BID]: 'Made a Bid',
    [ActionType.PASS]: 'Passed',
    [ActionType.FLIP_CARD]: 'Flipped Card',
    [ActionType.END_ROUND]: 'Ended Round',
    [ActionType.START_NEW_ROUND]: 'Started New Round',
    [ActionType.MESSAGE]: 'Sent a Message',
    [ActionType.QUIT_GAME]: 'Quit Game',
  },
  [StringLanguages.French]: {
    [ActionType.CREATE_GAME]: 'Créé un jeu',
    [ActionType.START_GAME]: 'Démarré le jeu',
    [ActionType.JOIN_GAME]: 'Rejoint le jeu',
    [ActionType.END_GAME]: 'Terminé le jeu',
    [ActionType.EXPIRE_GAME]: 'Jeu expiré',
    [ActionType.PLACE_CARD]: 'Placé une carte',
    [ActionType.START_BIDDING]: 'Commencé les enchères',
    [ActionType.MAKE_BID]: 'Fait une offre',
    [ActionType.PASS]: 'Passé',
    [ActionType.FLIP_CARD]: 'Retourné la carte',
    [ActionType.END_ROUND]: 'Terminé le tour',
    [ActionType.START_NEW_ROUND]: 'Commencé un nouveau tour',
    [ActionType.MESSAGE]: 'Envoyé un message',
    [ActionType.QUIT_GAME]: 'Quitté le jeu',
  },
  [StringLanguages.MandarinChinese]: {
    [ActionType.CREATE_GAME]: '创建游戏',
    [ActionType.START_GAME]: '开始游戏',
    [ActionType.JOIN_GAME]: '加入游戏',
    [ActionType.END_GAME]: '结束游戏',
    [ActionType.EXPIRE_GAME]: '游戏到期',
    [ActionType.PLACE_CARD]: '放置卡片',
    [ActionType.START_BIDDING]: '开始竞标',
    [ActionType.MAKE_BID]: '做出出价',
    [ActionType.PASS]: '通过',
    [ActionType.FLIP_CARD]: '翻转卡片',
    [ActionType.END_ROUND]: '结束回合',
    [ActionType.START_NEW_ROUND]: '开始新回合',
    [ActionType.MESSAGE]: '发送消息',
    [ActionType.QUIT_GAME]: '退出游戏',
  },
  [StringLanguages.Spanish]: {
    [ActionType.CREATE_GAME]: 'Creado un juego',
    [ActionType.START_GAME]: 'Comenzado el juego',
    [ActionType.JOIN_GAME]: 'Unido al juego',
    [ActionType.END_GAME]: 'Terminado el juego',
    [ActionType.EXPIRE_GAME]: 'Juego expirado',
    [ActionType.PLACE_CARD]: 'Colocado una carta',
    [ActionType.START_BIDDING]: 'Comenzado las ofertas',
    [ActionType.MAKE_BID]: 'Hecho una oferta',
    [ActionType.PASS]: 'Pasado',
    [ActionType.FLIP_CARD]: 'Volteado una carta',
    [ActionType.END_ROUND]: 'Terminado el turno',
    [ActionType.START_NEW_ROUND]: 'Comenzado un nuevo turno',
    [ActionType.MESSAGE]: 'Enviado un mensaje',
    [ActionType.QUIT_GAME]: 'Abandonado el juego',
  },
  [StringLanguages.Ukrainian]: {
    [ActionType.CREATE_GAME]: 'Створено гру',
    [ActionType.START_GAME]: 'Почато гру',
    [ActionType.JOIN_GAME]: 'Приєднався до гри',
    [ActionType.END_GAME]: 'Закінчено гру',
    [ActionType.EXPIRE_GAME]: 'Гра закінчилася',
    [ActionType.PLACE_CARD]: 'Поклав карту',
    [ActionType.START_BIDDING]: 'Почав торги',
    [ActionType.MAKE_BID]: 'Зробив ставку',
    [ActionType.PASS]: 'Пройшов',
    [ActionType.FLIP_CARD]: 'Перевернув карту',
    [ActionType.END_ROUND]: 'Закінчено раунд',
    [ActionType.START_NEW_ROUND]: 'Почав новий раунд',
    [ActionType.MESSAGE]: 'Відправив повідомлення',
    [ActionType.QUIT_GAME]: 'Покинув гру',
  },
};
