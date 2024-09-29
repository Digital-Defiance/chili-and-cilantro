import {
  ChefState,
  IChef,
  IChefDocument,
  IGame,
  IGameDocument,
  IUserDocument,
  ModelName,
  NotInGameError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Document, Types } from 'mongoose';
import { UtilityService } from './utility';

export class ChefService {
  public readonly getModel: GetModelFunction;
  constructor(getModel: GetModelFunction) {
    this.getModel = getModel;
  }

  /**
   * Creates a new chef in the database
   * @param game The game the chef is joining
   * @param user The user joining the game
   * @param userName The display name of the chef
   * @param host Whether the chef is the host of the game
   * @param chefId The id of the chef to create. If not provided, a new id will be generated
   * @returns A new chef document
   */
  public async newChefAsync(
    game: IGameDocument,
    user: IUserDocument,
    userName: string,
    host: boolean,
    chefId?: Types.ObjectId,
  ): Promise<IChefDocument> {
    const ChefModel = this.getModel<IChefDocument>(ModelName.Chef);
    const chef = await ChefModel.create({
      _id: chefId ?? new Types.ObjectId(),
      gameId: game._id,
      name: userName,
      userId: user._id,
      hand: UtilityService.makeHand(),
      placedCards: [],
      lostCards: [],
      state: ChefState.LOBBY,
      host: host,
    });
    return chef;
  }

  /**
   * Creates a new chef in a new game from an existing chef in a previous game
   * @param newGame The game the chef is joining
   * @param existingChef The chef to copy
   * @param newChefId The id of the chef to create. If not provided, a new id will be generated
   * @returns A new chef document
   */
  public async newChefFromExisting(
    newGame: IGameDocument,
    existingChef: IChefDocument,
    newChefId?: Types.ObjectId,
  ): Promise<IChefDocument> {
    const ChefModel = this.getModel<IChefDocument>(ModelName.Chef);
    const newChef = await ChefModel.create({
      _id: newChefId ?? new Types.ObjectId(),
      gameId: newGame._id,
      name: existingChef.name,
      userId: existingChef.userId,
      hand: UtilityService.makeHand(),
      placedCards: [],
      lostCards: [],
      state: ChefState.LOBBY,
      host: existingChef.host,
    });
    return newChef;
  }

  /**
   * Gets a chef by id
   * @param game The game the chef is in
   * @param user The user the chef belongs to
   * @returns The chef document
   */
  public async getGameChefOrThrowAsync(
    game: IGameDocument,
    user: IUserDocument,
  ): Promise<IChef & Document> {
    const ChefModel = this.getModel<IChefDocument>(ModelName.Chef);
    const chef = await ChefModel.findOne({
      gameId: game._id,
      userId: user._id,
    }).exec();
    if (!chef) {
      throw new NotInGameError();
    }
    return chef;
  }

  /**
   * Gets all chefs in a game
   * @param gameOrId The game or id of the game the chef is in
   * @returns An array of chef documents
   */
  public async getGameChefsByGameOrIdAsync(
    gameOrId: string | IGame,
  ): Promise<(IChef & Document)[]> {
    const ChefModel = this.getModel<IChefDocument>(ModelName.Chef);
    // verify that gameOrId is either a string or an IGame by checking whether there's an _id property
    const hasId = (obj: any): obj is IGame => {
      return obj._id !== undefined;
    };
    const gameId = hasId(gameOrId) ? gameOrId._id.toString() : gameOrId;
    const chefs = await ChefModel.find({ gameId: gameId });
    return chefs;
  }
}
