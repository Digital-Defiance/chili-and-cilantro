import { Router } from 'express';
import { gamesRouter } from './games.route';
import { usersRouter } from './users.route';

export const apiRouter = Router();

apiRouter.use('/games', gamesRouter);
apiRouter.use('/users', usersRouter);
