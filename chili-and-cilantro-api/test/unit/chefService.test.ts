import {
  ChefState,
  constants,
  IChefDocument,
  IGameDocument,
  IUserDocument,
  ModelName,
  NotInGameError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Model, Types } from 'mongoose';
import { ChefService } from '../../src/services/chef';
import { UtilityService } from '../../src/services/utility';
import { MockApplication } from '../fixtures/application';
import { generateChefGameUser } from '../fixtures/game';
import { generateUsername } from '../fixtures/user';

describe('ChefService', () => {
  let mockApplication: IApplication;
  let chefService: ChefService;
  let ChefModel: Model<IChefDocument>;

  beforeEach(() => {
    mockApplication = new MockApplication();
    chefService = new ChefService(mockApplication);
    ChefModel = mockApplication.getModel<IChefDocument>(ModelName.Chef);
  });

  describe('newChefAsync', () => {
    it('should create a new chef with a hand of cards', async () => {
      // Arrange
      const {
        game: mockGame,
        user: mockUser,
        chef: mockChef,
      } = generateChefGameUser(true);
      const username = generateUsername();
      const masterChef = true;

      const expectedHand = UtilityService.makeHand();
      (ChefModel as any).create = jest.fn().mockResolvedValueOnce([mockChef]);

      // Act
      const result = await chefService.newChefAsync(
        mockGame,
        mockUser,
        username,
        masterChef,
        mockChef._id,
      );

      // Assert
      expect((ChefModel as any).create).toHaveBeenCalledWith(
        [
          {
            _id: mockChef._id,
            gameId: mockGame._id,
            name: username,
            userId: mockUser._id,
            hand: expectedHand,
            placedCards: [],
            lostCards: [],
            state: ChefState.LOBBY,
            masterChef: masterChef,
          },
        ],
        { session: undefined },
      );
      expect(result).toBeDefined();
      // Add more assertions as needed
    });
    it('should generate a new chef id if one is not provided', async () => {
      // Arrange
      const {
        user: mockUser,
        chef: mockChef,
        game: mockGame,
      } = generateChefGameUser(true);
      const username = generateUsername();
      const masterChef = true;

      const expectedHand = UtilityService.makeHand();
      (ChefModel as any).create = jest.fn().mockResolvedValueOnce([mockChef]);

      // Act
      const result = await chefService.newChefAsync(
        mockGame,
        mockUser,
        username,
        masterChef,
      );

      // Assert
      expect((ChefModel as any).create).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            gameId: mockGame._id,
            name: username,
            userId: mockUser._id,
            hand: expectedHand,
            placedCards: [],
            lostCards: [],
            state: ChefState.LOBBY,
            masterChef: masterChef,
          }),
        ],
        { session: undefined },
      );
      expect(result).toBeDefined();
      expect(result._id).toBeDefined();
      expect(result._id).toBeInstanceOf(Types.ObjectId);
    });
  });
  describe('newChefFromExisting', () => {
    it('should create a new chef from an existing chef', async () => {
      // Arrange
      const {
        chef: existingChef,
        game: existingGame,
        user: existingUser,
      } = generateChefGameUser(true);
      const expectedHand = UtilityService.makeHand();
      const { chef: newChef, game: newGame } = generateChefGameUser(true, 0, {
        chef: {
          userId: existingUser._id,
          name: existingChef.name,
          hand: expectedHand,
        },
      });

      (ChefModel as any).create = jest.fn().mockResolvedValueOnce([newChef]);

      // Act
      const result = await chefService.newChefFromExisting(
        newGame,
        existingChef,
        newChef._id,
      );

      // Assert
      expect((ChefModel as any).create).toHaveBeenCalledWith(
        [
          {
            _id: newChef._id,
            gameId: newGame._id,
            name: existingChef.name,
            userId: existingChef.userId,
            hand: expectedHand,
            placedCards: [],
            lostCards: [],
            state: ChefState.LOBBY,
            masterChef: existingChef.masterChef,
          },
        ],
        { session: undefined },
      );
      expect(result).toBeDefined();
      expect(result._id).toEqual(newChef._id);
      expect(result.gameId).toEqual(newGame._id);
      expect(result.userId).toEqual(existingChef.userId);
      expect(result.hand).toEqual(expectedHand);
      expect(result.state).toEqual(ChefState.LOBBY);
    });
    it('should make a new chef from existing and generate an id if one is not provided', async () => {
      // Arrange
      const {
        chef: existingChef,
        game: existingGame,
        user: existingUser,
      } = generateChefGameUser(true);
      const expectedHand = UtilityService.makeHand();
      const { chef: newChef, game: newGame } = generateChefGameUser(true, 0, {
        chef: {
          userId: existingUser._id,
          name: existingChef.name,
          hand: expectedHand,
        },
      });

      (ChefModel as any).create = jest.fn().mockResolvedValueOnce([newChef]);

      // Act
      const result = await chefService.newChefFromExisting(
        newGame,
        existingChef,
      );

      // Assert
      expect((ChefModel as any).create).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            gameId: newGame._id,
            name: existingChef.name,
            userId: existingChef.userId,
            hand: expectedHand,
            placedCards: [],
            lostCards: [],
            state: ChefState.LOBBY,
            masterChef: existingChef.masterChef,
          }),
        ],
        { session: undefined },
      );
      expect(result).toBeDefined();
      expect(result._id).toEqual(newChef._id);
      expect(result._id).toBeInstanceOf(Types.ObjectId);
      expect(result.gameId).toEqual(newGame._id);
      expect(result.userId).toEqual(existingChef.userId);
      expect(result.hand).toEqual(expectedHand);
      expect(result.state).toEqual(ChefState.LOBBY);
    });
  });
  describe('getGameChefOrThrowAsync', () => {
    it('should return a chef if found', async () => {
      // Arrange
      const {
        chef: mockChef,
        game: mockGame,
        user: mockUser,
      } = generateChefGameUser(true);

      const mockQuery = {
        session: jest.fn().mockResolvedValueOnce(mockChef), // Mock the session method
      };

      // mock findOne to have an exec() which returns a chef
      (ChefModel as any).findOne = jest.fn().mockReturnValueOnce(mockQuery);

      // Act
      const result = await chefService.getGameChefOrThrowAsync(
        mockGame,
        mockUser,
      );

      // Assert
      expect((ChefModel as any).findOne).toHaveBeenCalledWith({
        gameId: mockGame._id,
        userId: mockUser._id,
      });
      expect(result).toBeDefined();
      expect(result).toEqual(
        expect.objectContaining({
          _id: mockChef._id,
          gameId: mockGame._id,
          hand: mockChef.hand,
          masterChef: mockChef.masterChef,
          name: mockChef.name,
          placedCards: mockChef.placedCards,
          lostCards: mockChef.lostCards,
          state: mockChef.state,
          userId: mockUser._id,
        }),
      );
      expect(mockQuery.session).toHaveBeenCalled();
    });

    it('should throw NotInGameError if no chef is found', async () => {
      // Arrange
      const gameId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const mockGame = { _id: gameId } as IGameDocument;
      const mockUser = { _id: userId } as IUserDocument;

      const mockQuery = {
        session: jest.fn().mockResolvedValueOnce(null), // Mock the session method
      };

      (ChefModel as any).findOne = jest.fn().mockReturnValueOnce(mockQuery);

      // Act & Assert
      await expect(async () =>
        chefService.getGameChefOrThrowAsync(mockGame, mockUser),
      ).rejects.toThrow(NotInGameError);
    });
  });
  describe('getGameChefsByGameOrIdAsync', () => {
    it('should return an array of chefs for a given game ID', async () => {
      // Arrange
      const {
        game: mockGame,
        user: mockUser,
        chef: mockChef,
        additionalChefs,
      } = generateChefGameUser(true, 2);
      const gameIdString = mockGame._id.toString();
      const mockChefs: IChefDocument<Types.ObjectId>[] = [
        mockChef,
        ...additionalChefs,
      ];

      const mockQuery = {
        session: jest.fn().mockResolvedValueOnce(mockChefs), // Mock the session method
      };

      (ChefModel as any).find = jest.fn().mockReturnValueOnce(mockQuery);

      // Act
      const result =
        await chefService.getGameChefsByGameOrIdAsync(gameIdString);

      // Assert
      expect((ChefModel as any).find).toHaveBeenCalledWith({
        gameId: mockGame._id,
      });
      expect(result).toBeDefined();
      expect(result).toEqual(mockChefs);
    });
    it('should return an array of chefs for a given game', async () => {
      // Arrange
      const {
        game: mockGame,
        user: mockUser,
        chef: mockChef,
        additionalChefs,
      } = generateChefGameUser(true, constants.MIN_CHEFS - 1);
      const mockChefs: IChefDocument[] = [mockChef, ...additionalChefs];
      const gameIdString = mockGame._id.toString();

      const mockQuery = {
        session: jest.fn().mockResolvedValueOnce(mockChefs), // Mock the session method
      };

      (ChefModel as any).find = jest.fn().mockReturnValue(mockQuery);
      // Act
      const result =
        await chefService.getGameChefsByGameOrIdAsync(gameIdString);

      // Assert
      expect((ChefModel as any).find).toHaveBeenCalledWith({
        gameId: mockGame._id,
      });
      expect(mockQuery.session).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual(mockChefs);
    });
  });
});
