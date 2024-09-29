import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Router } from 'express';

export abstract class BaseRouter {
  public readonly router: Router;
  public readonly getModel: GetModelFunction;
  protected constructor(getModel: GetModelFunction) {
    this.router = Router();
    this.getModel = getModel;
  }
}
