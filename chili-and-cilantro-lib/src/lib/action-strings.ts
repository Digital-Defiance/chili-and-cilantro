import ActionType from './enumerations/action-type';

export const ActionStringsMap: { [key in ActionType]: string } = {
  [ActionType.CREATE_GAME]: 'Created a new game',
  [ActionType.START_GAME]: 'Started the game',
  [ActionType.JOIN_GAME]: 'Joined the game',
  [ActionType.END_ROUND]: 'Ended the round',
  [ActionType.START_NEW_ROUND]: 'Started a new round',
  [ActionType.EXPIRE_GAME]: 'Expired the game',
  [ActionType.END_GAME]: 'Ended the game',
  [ActionType.PLACE_CARD]: 'Placed a card',
  [ActionType.START_BIDDING]: 'Started bidding',
  [ActionType.MAKE_BID]: 'Made a bid',
  [ActionType.PASS]: 'Passed',
  [ActionType.FLIP_CARD]: 'Flipped a card',
  [ActionType.MESSAGE]: 'Sent a message',
  [ActionType.QUIT_GAME]: 'Left the game',
};
