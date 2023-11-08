import { ObjectId } from 'mongodb';
import { Document, Model } from 'mongoose';
import { ChefState, IChef, IGame, IUser, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IDatabase } from '../interfaces/database';
import { UtilityService } from './utility';

export class ChefService {
  private readonly ChefModel: Model<IChef>;
  private readonly Database: IDatabase;
  constructor(database: IDatabase) {
    this.Database = database;
    this.ChefModel = database.getModel<IChef>(ModelName.Chef);
  }
  public async newChefAsync(game: IGame, user: IUser, userName: string, host: boolean, chefId?: ObjectId): Promise<IChef & Document> {
    const chef = await this.ChefModel.create({
      _id: chefId ?? new ObjectId(),
      gameId: game._id,
      name: userName,
      userId: user._id,
      hand: UtilityService.makeHand(),
      state: ChefState.LOBBY,
      host: host,
    });
    return chef;
  }
  public async newChefFromExisting(game: IGame, chef: IChef, newChefId?: ObjectId): Promise<IChef & Document> {
    const newChef = await this.ChefModel.create({
      _id: newChefId ?? new ObjectId(),
      gameId: game._id,
      name: chef.name,
      userId: chef.userId,
      hand: UtilityService.makeHand(),
      placedCards: [],
      state: ChefState.LOBBY,
      host: chef.host,
    });
    return newChef;
  }
  public async getChefAsync(game: IGame, user: IUser): Promise<IChef & Document> {
    const chef = await this.ChefModel.findOne({
      gameId: game._id,
      userId: user._id
    }).exec();
    return chef;
  }
  public async getChefsByGameIdAsync(gameId: string): Promise<(IChef & Document)[]> {
    const chefs = await this.ChefModel.find({ gameId: gameId });
    return chefs;

  }
  public async getChefsByGameAsync(game: IGame): Promise<(IChef & Document)[]> {
    const chefs = await this.getChefsByGameIdAsync(game._id.toString());
    return chefs;
  }
}