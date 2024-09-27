import { Router } from 'express';
import { gamesRouter } from './games';
import { usersRouter } from './users';

export const apiRouter = Router();

apiRouter.use('/games', gamesRouter);
apiRouter.use('/users', usersRouter);
