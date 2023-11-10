import sinon from 'sinon';
import { ObjectId } from 'mongodb';
import { PlayerService } from '../../src/services/player';
import { BaseModel, IGame, ModelName } from '@chili-and-cilantro/chili-and-cilantro-lib';

describe('PlayerService', () => {

  describe("isGameHostAsync", () => {
    let countDocumentsStub;
    let mockGameModel;
    let playerService;

    beforeEach(() => {
      mockGameModel = BaseModel.getModel<IGame>(ModelName.Game);
      playerService = new PlayerService(mockGameModel);
    });

    afterEach(() => {
      countDocumentsStub.restore();
    });

    it('should return true when the user is the host of the game', async () => {
      countDocumentsStub = sinon.stub(mockGameModel, 'countDocuments').returns({
        exec: sinon.stub().resolves(1)
      });
      const gameId = 'aaaaaaaaaaaa';
      const userId = 'bbbbbbbbbbbb';
      const result = await playerService.isGameHostAsync(userId, gameId);
      expect(result).toBe(true);
      sinon.assert.calledOnce(countDocumentsStub);
      sinon.assert.calledWith(countDocumentsStub, {
        _id: new ObjectId(gameId),
        hostUserId: new ObjectId(userId)
      });
    });

    it('should return false when the user is not the host of the game', async () => {
      countDocumentsStub = sinon.stub(mockGameModel, 'countDocuments').returns({
        exec: sinon.stub().resolves(0)
      });
      const gameId = 'aaaaaaaaaaaa';
      const userId = 'bbbbbbbbbbbb';
      const result = await playerService.isGameHostAsync(userId, gameId);
      expect(result).toBe(false);
      sinon.assert.calledOnce(countDocumentsStub);
      sinon.assert.calledWith(countDocumentsStub, {
        _id: new ObjectId(gameId),
        hostUserId: new ObjectId(userId)
      });
    });
  });

  describe("userIsInAnyActiveGameAsync", () => {
    let aggregateStub;
    let mockGameModel;
    let playerService;

    beforeEach(() => {
      mockGameModel = BaseModel.getModel<IGame>(ModelName.Game);
      playerService = new PlayerService(mockGameModel);
    });

    afterEach(() => {
      aggregateStub.restore();
    });

    it('should return true when the user is in any active game', async () => {
      aggregateStub = sinon.stub(mockGameModel, 'aggregate').resolves([{ activeGamesCount: 1 }]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const result = await playerService.userIsInAnyActiveGameAsync({ _id: userId });
      expect(result).toBe(true);
      sinon.assert.calledOnce(aggregateStub);
    });

    it('should return false when the user is not in any active game', async () => {
      aggregateStub = sinon.stub(mockGameModel, 'aggregate').resolves([]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const result = await playerService.userIsInAnyActiveGameAsync({ _id: userId });
      expect(result).toBe(false);
      sinon.assert.calledOnce(aggregateStub);
    });
  });

  describe("userIsInGameAsync", () => {
    let aggregateStub;
    let mockGameModel;
    let playerService;

    beforeEach(() => {
      mockGameModel = BaseModel.getModel<IGame>(ModelName.Game);
      playerService = new PlayerService(mockGameModel);
    });

    afterEach(() => {
      aggregateStub.restore();
    });

    it('should return true when the user is in the specified game', async () => {
      aggregateStub = sinon.stub(mockGameModel, 'aggregate').resolves([{ activeGamesCount: 1 }]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const gameId = new ObjectId('aaaaaaaaaaaa');
      const result = await playerService.userIsInGameAsync(userId.toString(), gameId.toString());
      expect(result).toBe(true);
      sinon.assert.calledOnce(aggregateStub);
    });

    it('should return false when the user is not in the specified game', async () => {
      aggregateStub = sinon.stub(mockGameModel, 'aggregate').resolves([]);
      const userId = new ObjectId('bbbbbbbbbbbb');
      const gameId = new ObjectId('aaaaaaaaaaaa');
      const result = await playerService.userIsInGameAsync(userId.toString(), gameId.toString());
      expect(result).toBe(false);
      sinon.assert.calledOnce(aggregateStub);
    });
  });
});
