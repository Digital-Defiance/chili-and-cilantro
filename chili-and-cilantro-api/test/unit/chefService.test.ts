import mongoose, { Schema } from 'mongoose';
import { generateChef } from '../fixtures/chef';
import { generateGame } from '../fixtures/game';
import { generateUser } from '../fixtures/user';
import { UtilityService } from '../../src/services/utility';
import { ChefService } from '../../src/services/chef';
import { faker } from '@faker-js/faker';
import { ChefState } from '../../../chili-and-cilantro-lib/src';

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
      const gameId = new Schema.Types.ObjectId('aaaaaaaaaaa');
      const mockUser = generateUser();
      const mockChef = generateChef(true, gameId, mockUser._id);
      const mockGame = generateGame(gameId, mockUser._id, mockChef._id, true);
      const userName = faker.internet.userName();
      const host = true;

      const expectedHand = UtilityService.makeHand();
      mockChefModel.create.mockResolvedValueOnce(mockChef);

      // Act
      const result = await chefService.newChefAsync(mockGame, mockUser, userName, host, mockChef._id);

      // Assert
      expect(mockChefModel.create).toHaveBeenCalledWith({
        _id: mockChef._id,
        gameId: mockGame._id,
        name: userName,
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
    it('should generate an id if one is not provided', async () => {
      // Arrange
      const gameId = new Schema.Types.ObjectId('aaaaaaaaaaa');
      const mockUser = generateUser();
      const mockChef = generateChef(true, gameId, mockUser._id);
      const mockGame = generateGame(gameId, mockUser._id, mockChef._id, true);
      const userName = faker.internet.userName();
      const host = true;

      const expectedHand = UtilityService.makeHand();
      mockChefModel.create.mockResolvedValueOnce(mockChef);

      // Act
      const result = await chefService.newChefAsync(mockGame, mockUser, userName, host);

      // Assert
      expect(mockChefModel.create).toHaveBeenCalledWith(expect.objectContaining({
        gameId: mockGame._id,
        name: userName,
        userId: mockUser._id,
        hand: expectedHand,
        placedCards: [],
        lostCards: [],
        state: ChefState.LOBBY,
        host: host,
      }));
      expect(result).toBeDefined();
      expect(result._id).toBeDefined();
      expect(result._id).toBeInstanceOf(Schema.Types.ObjectId);
    });
  });
  describe('newChefFromExisting', () => {
    it('should create a new chef from an existing chef', async () => {
      // Arrange
      const gameId = new Schema.Types.ObjectId('aaaaaaaaaaa');
      const existingChefId = new Schema.Types.ObjectId('bbbbbbbbbbbb');
      const newChefId = new Schema.Types.ObjectId('ccccccccccc');
      const mockUser = generateUser();
      const existingChef = generateChef(true, gameId, mockUser._id);
      const mockGame = generateGame(gameId, mockUser._id, existingChefId, true);
      const expectedHand = UtilityService.makeHand();

      mockChefModel.create.mockResolvedValueOnce({
        ...existingChef,
        _id: newChefId,
        hand: expectedHand,
        placedCards: [],
        lostCards: [],
        state: ChefState.LOBBY,
      });

      // Act
      const result = await chefService.newChefFromExisting(mockGame, existingChef, newChefId);

      // Assert
      expect(mockChefModel.create).toHaveBeenCalledWith({
        _id: newChefId,
        gameId: mockGame._id,
        name: existingChef.name,
        userId: existingChef.userId,
        hand: expectedHand,
        placedCards: [],
        lostCards: [],
        state: ChefState.LOBBY,
        host: existingChef.host,
      });
      expect(result).toBeDefined();
      expect(result._id).toEqual(newChefId);
      expect(result.gameId).toEqual(gameId);
      expect(result.userId).toEqual(existingChef.userId);
      expect(result.hand).toEqual(expectedHand);
      expect(result.state).toEqual(ChefState.LOBBY);
    });
  });
});
