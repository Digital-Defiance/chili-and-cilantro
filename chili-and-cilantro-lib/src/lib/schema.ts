// file: schema.ts
// description: This file contains the schema for all models in the system
// ---------------------------------------------------------------------------------------------
import { Action } from './enumerations/action';
import { ModelName } from './enumerations/modelName';
import { IUser } from './interfaces/user';
import { BaseModel } from './models/baseModel';
import { ISchemaModels } from './interfaces/schemaModels';
import { ModelData } from './schemaModelData';
import { IGame } from './interfaces/game';
import { IAction } from './interfaces/action';
import { IChef } from './interfaces/chef';
import { CreateGameActionSchema } from './schemas/createGameAction';
import { EndGameActionSchema } from './schemas/endGameAction';
import { EndRoundActionSchema } from './schemas/endRoundAction';
import { ExpireGameActionSchema } from './schemas/expireGameAction';
import { FlipCardActionSchema } from './schemas/flipCardAction';
import { JoinGameActionSchema } from './schemas/joinGameAction';
import { MakeBidActionSchema } from './schemas/makeBidAction';
import { MessageActionSchema } from './schemas/messageAction';
import { PassActionSchema } from './schemas/passAction';
import { PlaceCardActionSchema } from './schemas/placeCardAction';
import { QuitGameActionSchema } from './schemas/quitGameAction';
import { StartBiddingActionSchema } from './schemas/startBiddingAction';
import { StartGameActionSchema } from './schemas/startGameAction';
import { StartNewRoundActionSchema } from './schemas/startNewRoundAction';

const actionModel = BaseModel.create<IAction>(ModelData[ModelName.Action]).Model;
actionModel.discriminator(Action.CREATE_GAME, CreateGameActionSchema);
actionModel.discriminator(Action.END_GAME, EndGameActionSchema);
actionModel.discriminator(Action.END_ROUND, EndRoundActionSchema);
actionModel.discriminator(Action.EXPIRE_GAME, ExpireGameActionSchema);
actionModel.discriminator(Action.FLIP_CARD, FlipCardActionSchema);
actionModel.discriminator(Action.JOIN_GAME, JoinGameActionSchema);
actionModel.discriminator(Action.MAKE_BID, MakeBidActionSchema);
actionModel.discriminator(Action.MESSAGE, MessageActionSchema);
actionModel.discriminator(Action.PASS, PassActionSchema);
actionModel.discriminator(Action.PLACE_CARD, PlaceCardActionSchema);
actionModel.discriminator(Action.QUIT_GAME, QuitGameActionSchema);
actionModel.discriminator(Action.START_BIDDING, StartBiddingActionSchema);
actionModel.discriminator(Action.START_GAME, StartGameActionSchema);
actionModel.discriminator(Action.START_NEW_ROUND, StartNewRoundActionSchema);

export const SchemaModels: ISchemaModels = {
  Action: actionModel,
  Chef: BaseModel.create<IChef>(ModelData[ModelName.Chef]).Model,
  Game: BaseModel.create<IGame>(ModelData[ModelName.Game]).Model,
  User: BaseModel.create<IUser>(ModelData[ModelName.User]).Model,
};
