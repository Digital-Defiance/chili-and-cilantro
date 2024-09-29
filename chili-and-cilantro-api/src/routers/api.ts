import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Connection } from 'mongoose';
import { GameController } from '../controllers/api/game';
import { UserController } from '../controllers/api/user';
import { BaseRouter } from './base';

/**
 * Router for the API
 */
export class ApiRouter extends BaseRouter {
  private readonly userController: UserController;
  private readonly gameController: GameController;
  constructor(getModel: GetModelFunction, connnection: Connection) {
    super(getModel);
    this.userController = new UserController(getModel);
    this.gameController = new GameController(getModel, connnection);
    this.router.use('/user', this.userController.router);
    this.router.use('/game', this.gameController.router);
  }
}
