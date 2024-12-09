import { IApplication } from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Router } from 'express';

export abstract class BaseRouter {
  public readonly router: Router;
  public readonly application: IApplication;
  protected constructor(application: IApplication) {
    this.router = Router();
    this.application = application;
  }
}
