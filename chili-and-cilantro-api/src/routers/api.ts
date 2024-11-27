import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { GameController } from '../controllers/api/game';
import { UserController } from '../controllers/api/user';
import { BaseRouter } from './base';

/**
 * Router for the API
 */
export class ApiRouter extends BaseRouter {
  private readonly userController: UserController;
  private readonly gameController: GameController;
  constructor(application: IApplication) {
    super(application.getModel);
    this.userController = new UserController(application.getModel);
    this.gameController = new GameController(application);
    this.router.use('/user', this.userController.router);
    this.router.use('/game', this.gameController.router);
  }
}
