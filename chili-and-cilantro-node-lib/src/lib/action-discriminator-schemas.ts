import { ActionType } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { CreateGameActionSchema } from './schemas/actions/create-game';
import { EndGameActionSchema } from './schemas/actions/end-game';
import { EndRoundActionSchema } from './schemas/actions/end-round';
import { ExpireGameActionSchema } from './schemas/actions/expire-game';
import { FlipCardActionSchema } from './schemas/actions/flip-card';
import { JoinGameActionSchema } from './schemas/actions/join-game';
import { MakeBidActionSchema } from './schemas/actions/make-bid';
import { MessageActionSchema } from './schemas/actions/message';
import { PassActionSchema } from './schemas/actions/pass';
import { PlaceCardActionSchema } from './schemas/actions/place-card';
import { QuitGameActionSchema } from './schemas/actions/quit-game';
import { StartBiddingActionSchema } from './schemas/actions/start-bidding';
import { StartGameActionSchema } from './schemas/actions/start-game';
import { StartNewRoundActionSchema } from './schemas/actions/start-new-round';
import { ActionSchemaMapType } from './shared-types';

export const ActionDiscriminatorSchemas: ActionSchemaMapType = {
  [ActionType.CREATE_GAME]: CreateGameActionSchema,
  [ActionType.END_GAME]: EndGameActionSchema,
  [ActionType.END_ROUND]: EndRoundActionSchema,
  [ActionType.EXPIRE_GAME]: ExpireGameActionSchema,
  [ActionType.FLIP_CARD]: FlipCardActionSchema,
  [ActionType.JOIN_GAME]: JoinGameActionSchema,
  [ActionType.MAKE_BID]: MakeBidActionSchema,
  [ActionType.MESSAGE]: MessageActionSchema,
  [ActionType.PASS]: PassActionSchema,
  [ActionType.PLACE_CARD]: PlaceCardActionSchema,
  [ActionType.QUIT_GAME]: QuitGameActionSchema,
  [ActionType.START_BIDDING]: StartBiddingActionSchema,
  [ActionType.START_GAME]: StartGameActionSchema,
  [ActionType.START_NEW_ROUND]: StartNewRoundActionSchema,
};
