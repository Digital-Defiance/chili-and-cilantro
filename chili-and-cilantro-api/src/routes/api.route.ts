import { Router } from 'express';
import { usersRouter } from './users.route';

export const apiRouter = Router();

apiRouter.use('/users', usersRouter);
