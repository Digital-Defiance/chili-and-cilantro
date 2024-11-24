import { Types } from 'mongoose';
import { GamePhase } from '../../enumerations/game-phase';
import { IBid } from '../bid';

export interface IGame<T = Types.ObjectId> {
  /**
   * The game code.
   */
  code: string;
  /**
   * The game name.
   */
  name: string;
  /**
   * The game password.
   */
  password?: string;
  /**
   * Chef IDs in the game
   */
  chefIds: T[];
  /**
   * Eliminated chefs.
   */
  eliminatedChefIds: T[];
  /**
   * Maximum number of chefs that can join the game.
   */
  maxChefs: number;
  /**
   * The number of cards that have been placed in the current round.
   */
  cardsPlaced: number;
  /**
   * The current bid, or -1 if no bid has been placed.
   */
  currentBid: number;
  /**
   * The index of the current chef in the turnOrder.
   */
  currentChef: number;
  /**
   * The current phase of the game.
   */
  currentPhase: GamePhase;
  /**
   * The current round of the game.
   */
  currentRound: number;
  /**
   * The bid history for each round
   */
  roundBids: Record<number, IBid[]>;
  /**
   * The winning ChefIDs for each round.
   */
  roundWinners: Record<number, T>;
  /**
   * The turn order for the game. ChefIDs shuffled randomly into a turn order when the game is started.
   */
  turnOrder: T[];
  /**
   * The chef ID of the host chef who makes game decisions.
   */
  hostChefId: T;
  /**
   * The user ID of the host chef who created the game.
   */
  hostUserId: T;
  /**
   * The ID of the last game this is a continuation of.
   */
  lastGame?: T;
  /**
   * The winner of the game.
   */
  winner?: T;
}
