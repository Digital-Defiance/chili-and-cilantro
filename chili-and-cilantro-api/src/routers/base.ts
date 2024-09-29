import { GetModelFunction } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Router } from 'express';

export abstract class BaseRouter {
  public readonly router: Router;
  public readonly getModel: GetModelFunction;
  constructor(getModel: GetModelFunction) {
    this.router = Router();
    this.getModel = getModel;
  }
}
