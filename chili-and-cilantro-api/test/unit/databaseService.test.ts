import { Database } from '../../src/services/database';
import { Action } from '@chili-and-cilantro/chili-and-cilantro-lib';
import * as ChiliAndCilantroLib from '@chili-and-cilantro/chili-and-cilantro-lib';

describe('Database Service', () => {
  let databaseService;
  let mockGetModel;

  beforeEach(() => {
    databaseService = new Database();
    // Use jest.spyOn to spy on the getModel method
    mockGetModel = jest.spyOn(ChiliAndCilantroLib.BaseModel, 'getModel');
    mockGetModel.mockClear();
  });

  afterEach(() => {
    mockGetModel.mockRestore();
  });

  describe('getModel', () => {
    it('should return the correct model for a given model name', () => {
      // Arrange
      const modelName = 'SomeModel';
      const mockModel = {}; // Mock model object
      mockGetModel.mockReturnValue(mockModel);

      // Act
      const model = databaseService.getModel(modelName);

      // Assert
      expect(mockGetModel).toHaveBeenCalledWith(modelName);
      expect(model).toBe(mockModel);
    });
  });
  describe('getActionModel', () => {
    // Test each action type
    const actionTypes = [
      { action: Action.CREATE_GAME, model: ChiliAndCilantroLib.CreateGameDiscriminator },
      { action: Action.START_GAME, model: ChiliAndCilantroLib.StartGameDiscriminator },
      { action: Action.JOIN_GAME, model: ChiliAndCilantroLib.JoinGameDiscriminator },
      { action: Action.END_GAME, model: ChiliAndCilantroLib.EndGameDiscriminator },
      { action: Action.EXPIRE_GAME, model: ChiliAndCilantroLib.ExpireGameDiscriminator },
      { action: Action.PLACE_CARD, model: ChiliAndCilantroLib.PlaceCardDiscriminator },
      { action: Action.START_BIDDING, model: ChiliAndCilantroLib.StartBiddingDiscriminator },
      { action: Action.MAKE_BID, model: ChiliAndCilantroLib.MakeBidDiscriminator },
      { action: Action.PASS, model: ChiliAndCilantroLib.PassDiscriminator },
      { action: Action.FLIP_CARD, model: ChiliAndCilantroLib.FlipCardDiscriminator },
      { action: Action.END_ROUND, model: ChiliAndCilantroLib.EndRoundDiscriminator },
      { action: Action.START_NEW_ROUND, model: ChiliAndCilantroLib.StartNewRoundDiscriminator },
      { action: Action.MESSAGE, model: ChiliAndCilantroLib.MessageDiscriminator },
      { action: Action.QUIT_GAME, model: ChiliAndCilantroLib.QuitGameDiscriminator },
    ];

    actionTypes.forEach(({ action, model }) => {
      it(`should return the correct model for action type ${action}`, () => {
        // Act
        const actionModel = databaseService.getActionModel(action);

        // Assert
        expect(actionModel).toBe(model);
      });
    });
    it('should throw an error if the action type is not found', () => {
      // Arrange
      const action = 'SomeAction';

      // Act & Assert
      expect(() => databaseService.getActionModel(action)).toThrow(`Action type ${action} not found`);
    });
  });
});
