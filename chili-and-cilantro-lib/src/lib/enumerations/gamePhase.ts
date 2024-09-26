export enum GamePhase {
  LOBBY = 'LOBBY', // Chefs are joining, but the game has not started yet.
  SETUP = 'SETUP', // Initial cards distribution and preparation before the first round.
  ROUND_START = 'ROUND_START', // Indicating the beginning of a new round, chefs choose cards to place.
  BIDDING = 'BIDDING', // Chefs decide whether to raise the bid or pass.
  REVEAL = 'REVEAL', // The phase where the winning bidder flips the cards.
  RESOLUTION = 'RESOLUTION', // Consequences of the reveal phase are resolved, points assigned, and penalties given.
  ROUND_END = 'ROUND_END', // Cleanup after a round, preparation for the next round.
  GAME_OVER = 'GAME_OVER', // The game ends either when a chef meets the victory condition or all but one chef are eliminated.
}
