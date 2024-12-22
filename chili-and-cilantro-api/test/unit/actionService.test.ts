import {
  ActionType,
  CardType,
  constants,
  DefaultIdType,
  IActionDocument,
  IChefDocument,
  IGameDocument,
  IUserDocument,
  ModelName,
  ModelNameCollection,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ActionSchema,
  IApplication,
  IDiscriminatorCollections,
  ISchemaData,
  modelNameCollectionToPath,
  SchemaMap,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { faker } from '@faker-js/faker';
import { Model, Query } from 'mongoose';
import { ActionService } from '../../src/services/action';
import {
  generateCreateGameAction,
  generateExpireGameAction,
  generateJoinGameAction,
  generatePassAction,
  generatePlaceCardAction,
  generateSendMessageAction,
  generateStartBiddingAction,
  generateStartGameAction,
} from '../fixtures/action';
import { MockApplication } from '../fixtures/application';
import { generateChefGameUser } from '../fixtures/game';

function makeMockApplicationForDiscriminator(
  actionType: ActionType,
  createFn: jest.MockedFunction<any>,
): IApplication {
  const discriminators = {
    byType: {
      [actionType]: {
        create: createFn,
      } as unknown as Model<IActionDocument>,
    } as unknown as Record<string, Model<IActionDocument>>,
    array: [{ create: createFn }] as unknown as Model<IActionDocument>[],
  } as IDiscriminatorCollections<IActionDocument>;
  const mockApplication = {
    getModel: jest.fn().mockReturnValue(discriminators),
  } as unknown as IApplication;
  Object.defineProperty(mockApplication, 'schemaMap', {
    value: {
      Action: {
        name: ModelName.Action,
        collection: ModelNameCollection.Action,
        schema: ActionSchema,
        description: 'An action taken by a chef in a game.',
        path: modelNameCollectionToPath(ModelNameCollection.Action),
        discriminators: discriminators,
      } as ISchemaData<IActionDocument>,
    } as unknown as SchemaMap,
  });
  return mockApplication;
}

describe('ActionService', () => {
  let application: IApplication;
  let gameId: DefaultIdType;
  let mockGame: IGameDocument;
  let masterChef: IChefDocument;
  let masterChefUser: IUserDocument;

  beforeEach(async () => {
    application = new MockApplication();
    await application.start();
    const generated = generateChefGameUser(true);
    gameId = generated.game._id;
    mockGame = generated.game;
    masterChef = generated.chef;
    masterChefUser = generated.user;
  });

  describe('getGameHistoryAsync', () => {
    it('should retrieve game history', async () => {
      // Arrange
      const actionService = new ActionService(application);
      const ActionModel = application.getModel<IActionDocument>(
        ModelName.Action,
      );
      const mockActions: IActionDocument[] = [
        generateCreateGameAction(gameId, masterChef._id, masterChefUser._id),
      ];
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        session: jest.fn().mockResolvedValueOnce(mockActions),
      } as unknown as Query<IActionDocument[], IActionDocument>;

      jest.spyOn(ActionModel, 'find').mockReturnValue(mockQuery);

      // Act
      const result = await actionService.getGameHistoryAsync(mockGame);

      // Assert
      expect(ActionModel.find).toHaveBeenCalledWith({ gameId: gameId });
      expect(ActionModel.find().sort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(result).toEqual(mockActions);
      expect(mockQuery.session).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: 1 });
    });
  });

  describe('createGameAsync', () => {
    it('should create a game action', async () => {
      const createGame = jest
        .fn()
        .mockResolvedValue([
          generateCreateGameAction(gameId, masterChef._id, masterChefUser._id),
        ]);

      const actionService = new ActionService(
        makeMockApplicationForDiscriminator(ActionType.CREATE_GAME, createGame),
      );

      const result = await actionService.createGameAsync(
        mockGame,
        masterChef,
        masterChefUser,
      );

      expect(createGame).toHaveBeenCalledWith(
        [
          {
            gameId: gameId,
            chefId: masterChef._id,
            userId: masterChefUser._id,
            type: ActionType.CREATE_GAME,
            details: {},
            round: constants.NONE,
          },
        ],
        { session: undefined },
      );
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(masterChef._id);
      expect(result.userId).toEqual(masterChefUser._id);
      expect(result.type).toEqual(ActionType.CREATE_GAME);
    });
  });
  describe('joinGameAsync', () => {
    it('should create a join game action', async () => {
      // Arrange
      const joinGame = jest
        .fn()
        .mockResolvedValue([
          generateJoinGameAction(gameId, masterChef._id, masterChefUser._id),
        ]);
      const actionService = new ActionService(
        makeMockApplicationForDiscriminator(ActionType.JOIN_GAME, joinGame),
      );

      // Act
      const result = await actionService.joinGameAsync(
        mockGame,
        masterChef,
        masterChefUser,
      );

      // Assert
      expect(joinGame).toHaveBeenCalledWith(
        [
          {
            gameId: gameId,
            chefId: masterChef._id,
            userId: masterChefUser._id,
            type: ActionType.JOIN_GAME,
            details: {},
            round: constants.NONE,
          },
        ],
        { session: undefined },
      );
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(masterChef._id);
      expect(result.userId).toEqual(masterChefUser._id);
      expect(result.type).toEqual(ActionType.JOIN_GAME);
    });
  });
  describe('startGameAsync', () => {
    it('should create a start game action', async () => {
      // Arrange
      const startGame = jest
        .fn()
        .mockResolvedValue([
          generateStartGameAction(gameId, masterChef._id, masterChefUser._id),
        ]);
      const actionService = new ActionService(
        makeMockApplicationForDiscriminator(ActionType.START_GAME, startGame),
      );

      // Act
      const result = await actionService.startGameAsync(mockGame);

      // Assert
      expect(startGame).toHaveBeenCalledWith(
        [
          {
            gameId: gameId,
            chefId: masterChef._id,
            userId: masterChefUser._id,
            type: ActionType.START_GAME,
            details: {},
            round: constants.NONE,
          },
        ],
        { session: undefined },
      );
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(masterChef._id);
      expect(result.userId).toEqual(masterChefUser._id);
      expect(result.type).toEqual(ActionType.START_GAME);
    });
  });
  describe('expireGameAsync', () => {
    it('should create an expire game action', async () => {
      // Arrange
      const expireGame = jest
        .fn()
        .mockResolvedValue([
          generateExpireGameAction(gameId, masterChef._id, masterChefUser._id),
        ]);
      const actionService = new ActionService(
        makeMockApplicationForDiscriminator(ActionType.EXPIRE_GAME, expireGame),
      );

      // Act
      const result = await actionService.expireGameAsync(mockGame);

      // Assert
      expect(expireGame).toHaveBeenCalledWith(
        [
          {
            gameId: gameId,
            chefId: masterChef._id,
            userId: masterChefUser._id,
            type: ActionType.EXPIRE_GAME,
            details: {},
            round: constants.NONE,
          },
        ],
        { session: undefined },
      );
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(masterChef._id);
      expect(result.userId).toEqual(masterChefUser._id);
      expect(result.type).toEqual(ActionType.EXPIRE_GAME);
    });
  });
  describe('sendMessageAsync', () => {
    it('should create a message action', async () => {
      // Arrange
      const message = faker.lorem.sentence();
      const messageAction = jest
        .fn()
        .mockResolvedValue([
          generateSendMessageAction(
            gameId,
            masterChef._id,
            masterChefUser._id,
            message,
          ),
        ]);
      const actionService = new ActionService(
        makeMockApplicationForDiscriminator(ActionType.MESSAGE, messageAction),
      );

      // Act
      const result = await actionService.sendMessageAsync(
        mockGame,
        masterChef,
        message,
      );

      // Assert
      expect(messageAction).toHaveBeenCalledWith(
        [
          {
            gameId: gameId,
            chefId: masterChef._id,
            userId: masterChefUser._id,
            type: ActionType.MESSAGE,
            details: {
              message: message,
            },
            round: constants.NONE,
          },
        ],
        { session: undefined },
      );
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(masterChef._id);
      expect(result.userId).toEqual(masterChefUser._id);
      expect(result.type).toEqual(ActionType.MESSAGE);
      expect(result.details.message).toEqual(message);
    });
  });
  describe('startBiddingAsync', () => {
    it('should create a start bidding action', async () => {
      // Arrange
      const round = faker.number.int({ min: 1, max: 10 });
      const bid = faker.number.int({ min: 1, max: 10 });
      const startBidding = jest
        .fn()
        .mockResolvedValue([
          generateStartBiddingAction(
            gameId,
            masterChef._id,
            masterChefUser._id,
            round,
            bid,
          ),
        ]);
      const actionService = new ActionService(
        makeMockApplicationForDiscriminator(
          ActionType.START_BIDDING,
          startBidding,
        ),
      );

      // Act
      const result = await actionService.startBiddingAsync(
        mockGame,
        masterChef,
        bid,
      );

      // Assert
      expect(startBidding).toHaveBeenCalledWith(
        [
          {
            gameId: gameId,
            chefId: masterChef._id,
            userId: masterChefUser._id,
            type: ActionType.START_BIDDING,
            details: {
              bid: bid,
            },
            round: expect.any(Number),
          },
        ],
        { session: undefined },
      );
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(masterChef._id);
      expect(result.userId).toEqual(masterChefUser._id);
      expect(result.type).toEqual(ActionType.START_BIDDING);
      expect(result.details.bid).toEqual(bid);
      expect(result.round).toEqual(expect.any(Number));
    });
  });
  describe('passAsync', () => {
    it('should create a pass action', async () => {
      const round = faker.number.int({ min: 1, max: 10 });
      // Arrange
      const passAction = jest
        .fn()
        .mockResolvedValue([
          generatePassAction(gameId, masterChef._id, masterChefUser._id, round),
        ]);
      const actionService = new ActionService(
        makeMockApplicationForDiscriminator(ActionType.PASS, passAction),
      );

      // Act
      const result = await actionService.passAsync(mockGame, masterChef);

      // Assert
      expect(passAction).toHaveBeenCalledWith(
        [
          {
            gameId: gameId,
            chefId: masterChef._id,
            userId: masterChefUser._id,
            type: ActionType.PASS,
            details: {},
            round: expect.any(Number),
          },
        ],
        { session: undefined },
      );
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(masterChef._id);
      expect(result.userId).toEqual(masterChefUser._id);
      expect(result.type).toEqual(ActionType.PASS);
      expect(result.round).toEqual(expect.any(Number));
    });
  });
  describe('placeCardAsync', () => {
    it('should create a place card action', async () => {
      // Arrange
      const round = faker.number.int({ min: 1, max: 10 });
      const cardType = faker.helpers.enumValue(CardType);
      const position: number = faker.number.int({ min: 0, max: 4 });
      const placeCard = jest
        .fn()
        .mockResolvedValue([
          generatePlaceCardAction(
            gameId,
            masterChef._id,
            masterChefUser._id,
            round,
            cardType,
            position,
          ),
        ]);
      const actionService = new ActionService(
        makeMockApplicationForDiscriminator(ActionType.PLACE_CARD, placeCard),
      );

      // Act
      const result = await actionService.placeCardAsync(
        mockGame,
        masterChef,
        cardType,
        position,
      );

      // Assert
      expect(placeCard).toHaveBeenCalledWith(
        [
          {
            gameId: gameId,
            chefId: masterChef._id,
            userId: masterChefUser._id,
            type: ActionType.PLACE_CARD,
            details: {
              cardType: cardType,
              position: position,
            },
            round: expect.any(Number),
          },
        ],
        { session: undefined },
      );
      expect(result.gameId).toEqual(gameId);
      expect(result.chefId).toEqual(masterChef._id);
      expect(result.userId).toEqual(masterChefUser._id);
      expect(result.type).toEqual(ActionType.PLACE_CARD);
      expect(result.round).toEqual(expect.any(Number));
      expect(result.details.cardType).toEqual(cardType);
      expect(result.details.position).toEqual(position);
    });
  });
});
