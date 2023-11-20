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
import { ICreateGameAction } from './interfaces/createGameAction';
import { IEndGameAction } from './interfaces/endGameAction';
import { IEndRoundAction } from './interfaces/endRoundAction';
import { IExpireGameAction } from './interfaces/expireGameAction';
import { IFlipCardAction } from './interfaces/flipCardAction';
import { IJoinGameAction } from './interfaces/joinGameAction';
import { IMakeBidAction } from './interfaces/makeBidAction';
import { IMessageAction } from './interfaces/messageAction';
import { IPassAction } from './interfaces/passAction';
import { IPlaceCardAction } from './interfaces/placeCardAction';
import { IQuitGameAction } from './interfaces/quitGameAction';
import { IStartBiddingAction } from './interfaces/startBiddingAction';
import { IStartGameAction } from './interfaces/startGameAction';
import { IStartNewRoundAction } from './interfaces/startNewRoundAction';

const actionModel = BaseModel.create<IAction>(ModelData[ModelName.Action]).Model;
export const CreateGameDiscriminator = actionModel.discriminator<ICreateGameAction>(Action.CREATE_GAME, CreateGameActionSchema);
export const EndGameDiscriminator = actionModel.discriminator<IEndGameAction>(Action.END_GAME, EndGameActionSchema);
export const EndRoundDiscriminator = actionModel.discriminator<IEndRoundAction>(Action.END_ROUND, EndRoundActionSchema);
export const ExpireGameDiscriminator = actionModel.discriminator<IExpireGameAction>(Action.EXPIRE_GAME, ExpireGameActionSchema);
export const FlipCardDiscriminator = actionModel.discriminator<IFlipCardAction>(Action.FLIP_CARD, FlipCardActionSchema);
export const JoinGameDiscriminator = actionModel.discriminator<IJoinGameAction>(Action.JOIN_GAME, JoinGameActionSchema);
export const MakeBidDiscriminator = actionModel.discriminator<IMakeBidAction>(Action.MAKE_BID, MakeBidActionSchema);
export const MessageDiscriminator = actionModel.discriminator<IMessageAction>(Action.MESSAGE, MessageActionSchema);
export const PassDiscriminator = actionModel.discriminator<IPassAction>(Action.PASS, PassActionSchema);
export const PlaceCardDiscriminator = actionModel.discriminator<IPlaceCardAction>(Action.PLACE_CARD, PlaceCardActionSchema);
export const QuitGameDiscriminator = actionModel.discriminator<IQuitGameAction>(Action.QUIT_GAME, QuitGameActionSchema);
export const StartBiddingDiscriminator = actionModel.discriminator<IStartBiddingAction>(Action.START_BIDDING, StartBiddingActionSchema);
export const StartGameDiscriminator = actionModel.discriminator<IStartGameAction>(Action.START_GAME, StartGameActionSchema);
export const StartNewRoundDiscriminator = actionModel.discriminator<IStartNewRoundAction>(Action.START_NEW_ROUND, StartNewRoundActionSchema);

export const SchemaModels: ISchemaModels = {
  Action: actionModel,
  Chef: BaseModel.create<IChef>(ModelData[ModelName.Chef]).Model,
  Game: BaseModel.create<IGame>(ModelData[ModelName.Game]).Model,
  User: BaseModel.create<IUser>(ModelData[ModelName.User]).Model,
};
