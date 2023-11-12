import { Schema } from "mongoose";
import { IBid } from './bid';
import { IHasID } from "./hasId";
import { IHasTimestamps } from "./hasTimestamps";
import { GamePhase } from "../enumerations/gamePhase";

export interface IGame extends IHasID, IHasTimestamps {
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
  chefIds: Schema.Types.ObjectId[];
  /**
   * Eliminated chefs.
   */
  eliminatedChefIds: Schema.Types.ObjectId[];
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
  roundWinners: Record<number, Schema.Types.ObjectId>;
  /**
   * The turn order for the game. ChefIDs shuffled randomly into a turn order when the game is started.
   */
  turnOrder: Schema.Types.ObjectId[];
  /**
   * The chef ID of the host chef who makes game decisions.
   */
  hostChefId: Schema.Types.ObjectId;
  /**
   * The user ID of the host chef who created the game.
   */
  hostUserId: Schema.Types.ObjectId;
  /**
   * The ID of the last game this is a continuation of.
   */
  lastGame?: Schema.Types.ObjectId;
  /**
   * The winner of the game.
   */
  winner?: Schema.Types.ObjectId;
}