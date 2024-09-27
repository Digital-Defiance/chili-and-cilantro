import {
  ActionType,
  IActionDocument,
  ICreateGameActionDocument,
  IEndGameActionDocument,
  IEndRoundActionDocument,
  IExpireGameActionDocument,
  IFlipCardActionDocument,
  IJoinGameActionDocument,
  IMakeBidActionDocument,
  IMessageActionDocument,
  IPassActionDocument,
  IPlaceCardAction,
  IQuitGameActionDocument,
  IStartBiddingActionDocument,
  IStartGameActionDocument,
  IStartNewRoundActionDocument,
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { model } from 'mongoose';
import { ActionSchema } from '../schemas/action';
import { CreateGameActionSchema } from '../schemas/actions/create-game';
import { EndGameActionSchema } from '../schemas/actions/end-game';
import { EndRoundActionSchema } from '../schemas/actions/end-round';
import { ExpireGameActionSchema } from '../schemas/actions/expire-game';
import { FlipCardActionSchema } from '../schemas/actions/flip-card';
import { JoinGameActionSchema } from '../schemas/actions/join-game';
import { MakeBidActionSchema } from '../schemas/actions/make-bid';
import { MessageActionSchema } from '../schemas/actions/message';
import { PassActionSchema } from '../schemas/actions/pass';
import { PlaceCardActionSchema } from '../schemas/actions/place-card';
import { QuitGameActionSchema } from '../schemas/actions/quit-game';
import { StartBiddingActionSchema } from '../schemas/actions/start-bidding';
import { StartGameActionSchema } from '../schemas/actions/start-game';
import { StartNewRoundActionSchema } from '../schemas/actions/start-new-round';

export const ActionModel = model<IActionDocument>(
  ModelName.Action,
  ActionSchema,
  ModelNameCollection.Action,
);

// export const CreateGameDiscriminator =
//   ActionModel.discriminator<ICreateGameActionDocument>(
//     ActionType.CREATE_GAME,
//     CreateGameActionSchema,
//   );
// export const EndGameDiscriminator =
//   ActionModel.discriminator<IEndGameActionDocument>(
//     ActionType.END_GAME,
//     EndGameActionSchema,
//   );
// export const EndRoundDiscriminator =
//   ActionModel.discriminator<IEndRoundActionDocument>(
//     ActionType.END_ROUND,
//     EndRoundActionSchema,
//   );
// export const ExpireGameDiscriminator =
//   ActionModel.discriminator<IExpireGameActionDocument>(
//     ActionType.EXPIRE_GAME,
//     ExpireGameActionSchema,
//   );
// export const FlipCardDiscriminator =
//   ActionModel.discriminator<IFlipCardActionDocument>(
//     ActionType.FLIP_CARD,
//     FlipCardActionSchema,
//   );
// export const JoinGameDiscriminator =
//   ActionModel.discriminator<IJoinGameActionDocument>(
//     ActionType.JOIN_GAME,
//     JoinGameActionSchema,
//   );
// export const MakeBidDiscriminator =
//   ActionModel.discriminator<IMakeBidActionDocument>(
//     ActionType.MAKE_BID,
//     MakeBidActionSchema,
//   );
// export const MessageDiscriminator =
//   ActionModel.discriminator<IMessageActionDocument>(
//     ActionType.MESSAGE,
//     MessageActionSchema,
//   );
// export const PassDiscriminator = ActionModel.discriminator<IPassActionDocument>(
//   ActionType.PASS,
//   PassActionSchema,
// );
// export const PlaceCardDiscriminator =
//   ActionModel.discriminator<IPlaceCardAction>(
//     ActionType.PLACE_CARD,
//     PlaceCardActionSchema,
//   );
// export const QuitGameDiscriminator =
//   ActionModel.discriminator<IQuitGameActionDocument>(
//     ActionType.QUIT_GAME,
//     QuitGameActionSchema,
//   );
// export const StartBiddingDiscriminator =
//   ActionModel.discriminator<IStartBiddingActionDocument>(
//     ActionType.START_BIDDING,
//     StartBiddingActionSchema,
//   );
// export const StartGameDiscriminator =
//   ActionModel.discriminator<IStartGameActionDocument>(
//     ActionType.START_GAME,
//     StartGameActionSchema,
//   );
// export const StartNewRoundDiscriminator =
//   ActionModel.discriminator<IStartNewRoundActionDocument>(
//     ActionType.START_NEW_ROUND,
//     StartNewRoundActionSchema,
//   );

export default ActionModel;