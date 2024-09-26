import mongoose, { Schema } from 'mongoose';
import { generateObjectId } from '../fixtures/objectId';
import { generateChef } from '../fixtures/chef';
import { generateGame, generateChefGameUser } from '../fixtures/game';
import { generateUser, generateUsername } from '../fixtures/user';
import { UtilityService } from '../../src/services/utility';
import { ChefService } from '../../src/services/chef';
import { faker } from '@faker-js/faker';
import { ChefState } from '../../../chili-and-cilantro-lib/src';
import { NotInGameError } from 'chili-and-cilantro-api/src/errors/notInGame';
import constants from 'chili-and-cilantro-lib/src/lib/constants';

// Mocks
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    Model: function () {
      return {
        create: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
      };
    },
  };
});

describe('ChefService', () => {
  let chefService;
  let mockChefModel;

  beforeEach(() => {
    mockChefModel = new mongoose.Model();
    chefService = new ChefService(mockChefModel);
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
      const host = true;

      const expectedHand = UtilityService.makeHand();
      mockChefModel.create.mockResolvedValueOnce(mockChef);

      // Act
      const result = await chefService.newChefAsync(
        mockGame,
        mockUser,
        username,
        host,
        mockChef._id
      );

      // Assert
      expect(mockChefModel.create).toHaveBeenCalledWith({
        _id: mockChef._id,
        gameId: mockGame._id,
        name: username,
        userId: mockUser._id,
        hand: expectedHand,
        placedCards: [],
        lostCards: [],
        state: ChefState.LOBBY,
        host: host,
      });
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
      const host = true;

      const expectedHand = UtilityService.makeHand();
      mockChefModel.create.mockResolvedValueOnce(mockChef);

      // Act
      const result = await chefService.newChefAsync(
        mockGame,
        mockUser,
        username,
        host
      );

      // Assert
      expect(mockChefModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          gameId: mockGame._id,
          name: username,
          userId: mockUser._id,
          hand: expectedHand,
          placedCards: [],
          lostCards: [],
          state: ChefState.LOBBY,
          host: host,
        })
      );
      expect(result).toBeDefined();
      expect(result._id).toBeDefined();
      expect(result._id).toBeInstanceOf(Schema.Types.ObjectId);
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

      mockChefModel.create.mockResolvedValueOnce(newChef);

      // Act
      const result = await chefService.newChefFromExisting(
        newGame,
        existingChef,
        newChef._id
      );

      // Assert
      expect(mockChefModel.create).toHaveBeenCalledWith({
        _id: newChef._id,
        gameId: newGame._id,
        name: existingChef.name,
        userId: existingChef.userId,
        hand: expectedHand,
        placedCards: [],
        lostCards: [],
        state: ChefState.LOBBY,
        host: existingChef.host,
      });
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

      mockChefModel.create.mockResolvedValueOnce(newChef);

      // Act
      const result = await chefService.newChefFromExisting(
        newGame,
        existingChef
      );

      // Assert
      expect(mockChefModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          gameId: newGame._id,
          name: existingChef.name,
          userId: existingChef.userId,
          hand: expectedHand,
          placedCards: [],
          lostCards: [],
          state: ChefState.LOBBY,
          host: existingChef.host,
        })
      );
      expect(result).toBeDefined();
      expect(result._id).toEqual(newChef._id);
      expect(result._id).toBeInstanceOf(Schema.Types.ObjectId);
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

      // mock findOne to have an exec() which returns a chef
      mockChefModel.findOne.mockImplementationOnce(() => {
        return {
          exec: jest.fn().mockResolvedValueOnce(mockChef),
        };
      });

      // Act
      const result = await chefService.getGameChefOrThrowAsync(
        mockGame,
        mockUser
      );

      // Assert
      expect(mockChefModel.findOne).toHaveBeenCalledWith({
        gameId: mockGame._id,
        userId: mockUser._id,
      });
      expect(result).toBeDefined();
      expect(result).toEqual(mockChef);
    });

    it('should throw NotInGameError if no chef is found', async () => {
      // Arrange
      const gameId = generateObjectId();
      const userId = generateObjectId();
      const mockGame = { _id: gameId };
      const mockUser = { _id: userId };

      mockChefModel.findOne.mockImplementationOnce(() => {
        return {
          exec: jest.fn().mockResolvedValueOnce(null),
        };
      });

      // Act & Assert
      await expect(
        chefService.getGameChefOrThrowAsync(mockGame, mockUser)
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
      const mockChefs = [mockChef, ...additionalChefs];

      mockChefModel.find.mockResolvedValueOnce(mockChefs);

      // Act
      const result = await chefService.getGameChefsByGameOrIdAsync(
        gameIdString
      );

      // Assert
      expect(mockChefModel.find).toHaveBeenCalledWith({
        gameId: gameIdString,
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
      const mockChefs = [mockChef, ...additionalChefs];
      const gameIdString = mockGame._id.toString();

      mockChefModel.find.mockResolvedValueOnce(mockChefs);

      // Act
      const result = await chefService.getGameChefsByGameOrIdAsync(
        gameIdString
      );

      // Assert
      expect(mockChefModel.find).toHaveBeenCalledWith({
        gameId: gameIdString,
      });
      expect(result).toBeDefined();
      expect(result).toEqual(mockChefs);
    });
  });
});
