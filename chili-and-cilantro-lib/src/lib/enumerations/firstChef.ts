export enum FirstChef {
  /**
   * The first chef is the highest bidder who successfully challenged of the last game or random for the first game.
   */
  HIGHEST_BIDDER = 'highest successful bidder',
  /**
   * The first chef is the last winner of the game or random for the first game.
   */
  LAST_WINNER = 'last winner',
  /**
   * The first chef is randomly selected.
   */
  RANDOM = 'random',
  /**
   * The first chef is selected by the game host.
   */
  SELECTED = 'selected',
}