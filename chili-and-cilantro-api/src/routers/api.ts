import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { UserController } from '../controllers/api/user';
import { BaseRouter } from './base';

/**
 * Router for the API
 */
export class ApiRouter extends BaseRouter {
  private readonly userController: UserController;
  constructor(getModel: GetModelFunction) {
    super(getModel);
    this.userController = new UserController(getModel);
    this.router.use('/user', this.userController.router);
  }
}
