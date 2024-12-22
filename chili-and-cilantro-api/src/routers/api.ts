import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { GameController } from '../controllers/api/game';
import { I18nController } from '../controllers/api/i18n';
import { PusherController } from '../controllers/api/pusher';
import { UserController } from '../controllers/api/user';
import { BaseRouter } from './base';

/**
 * Router for the API
 */
export class ApiRouter extends BaseRouter {
  private readonly userController: UserController;
  private readonly gameController: GameController;
  private readonly i18nController: I18nController;
  private readonly pusherController: PusherController;

  constructor(application: IApplication) {
    super(application);
    this.userController = new UserController(application);
    this.gameController = new GameController(application);
    this.i18nController = new I18nController(application);
    this.pusherController = new PusherController(application);
    this.router.use('/i18n', this.i18nController.router);
    this.router.use('/user', this.userController.router);
    this.router.use('/game', this.gameController.router);
    this.router.use('/pusher', this.pusherController.router);
  }
}
