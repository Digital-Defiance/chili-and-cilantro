import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { GamePhase, IGame, IUser, ModelData, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IDatabase } from '../interfaces/database';

export class PlayerService {
  private readonly GameModel: Model<IGame>;
  constructor(gameModel: Model<IGame>) {
    this.GameModel = gameModel;
  }

  /**
* Returns whether the specified user is the host of the specified game
* @param userId
* @param gameId
* @returns boolean
*/
  public async isGameHostAsync(userId: string, gameId: string): Promise<boolean> {
    try {
      const count = await this.GameModel.countDocuments({
        _id: new ObjectId(gameId),
        hostUserId: new ObjectId(userId)
      }).exec();

      return count > 0;
    } catch (err) {
      console.error('Error checking if user is host of game:', err);
      throw err;
    }
  }


  /**
   * Returns whether the specified user is in any active game
   * @param userId
   * @returns boolean
   */
  public async userIsInAnyActiveGameAsync(user: IUser): Promise<boolean> {
    try {
      const result = await this.GameModel.aggregate([
        {
          $match: {
            currentPhase: { $ne: GamePhase.GAME_OVER }
          }
        },
        {
          $lookup: {
            from: ModelData.Chef.collection,
            localField: 'chefIds',
            foreignField: '_id',
            as: 'chefDetails'
          }
        },
        {
          $unwind: '$chefDetails'
        },
        {
          $match: {
            'chefDetails.userId': user._id
          }
        },
        {
          $count: 'activeGamesCount'
        }
      ]);

      // If the aggregation result is empty, count is 0, otherwise, it's the returned count
      const count = result.length > 0 ? result[0].activeGamesCount : 0;
      return count > 0;
    } catch (err) {
      // Handle the error appropriately
      console.error('Error checking if user is in game:', err);
      throw err;
    }
  }

  /**
   * Returns whether the user is in the specified game, regardless of game state
   * @param userId 
   * @param gameId 
   * @returns boolean
   */
  public async userIsInGameAsync(userId: string, gameId: string, active = false): Promise<boolean> {
    try {
      const result = await this.GameModel.aggregate([
        {
          $match: {
            _id: new ObjectId(gameId),
            ...active ? { currentPhase: { $ne: GamePhase.GAME_OVER } } : {}
          }
        },
        {
          $lookup: {
            from: ModelData.Chef.collection,
            localField: 'chefIds',
            foreignField: '_id',
            as: 'chefDetails'
          }
        },
        {
          $unwind: '$chefDetails'
        },
        {
          $match: {
            'chefDetails.userId': new ObjectId(userId) // Match specific userId
          }
        },
        {
          $count: 'activeGamesCount'
        }
      ]);

      // If the aggregation result is empty, count is 0, otherwise, it's the returned count
      const count = result.length > 0 ? result[0].activeGamesCount : 0;
      return count > 0;
    } catch (err) {
      // Handle the error appropriately
      console.error('Error checking if user is in the specified game:', err);
      throw err; // Or you might want to return false or handle this differently
    }
  }
}