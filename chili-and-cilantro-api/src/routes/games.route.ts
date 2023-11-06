import { Request, Response, Router } from 'express';
import { validateAccessToken } from '../middlewares/auth0';
import { GameService } from '../services/gameService';
import { JwtService } from '../services/jwtService';
import { FirstChef } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Database } from '../services/database';
import { ValidationError } from '../errors/validationError';

export const gamesRouter = Router();

gamesRouter.post('/create', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const { name, userName, password, maxChefs, firstChef } = req.body;
      const sanitizedName = (name as string)?.trim();
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim().toLowerCase();
      const sanitizedMaxChefs = parseInt(maxChefs, 10);
      const sanitizedFirstChef: FirstChef = firstChef as FirstChef;

      const database = new Database();
      const gameService = new GameService(database);
      const { game, chef } = await gameService.createGameAsync(user, sanitizedUserName, sanitizedName, sanitizedPassword, sanitizedMaxChefs, sanitizedFirstChef);
      res.send({ game, chef });
    }
    catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  });

gamesRouter.post('/join', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const { gameId, userName, password } = req.body;
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim().toLowerCase();

      const database = new Database();
      const gameService = new GameService(database);
      const { game, chef } = await gameService.joinGameAsync(gameId, sanitizedPassword, user, sanitizedUserName);
      res.send({ game, chef });
    }
    catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  });

gamesRouter.post('/message', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedTokenAsync(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const { gameId, message } = req.body;
      const sanitizedMessage = (message as string)?.trim();
      const database = new Database();
      const gameService = new GameService(database);
      await gameService.sendMessageAsync(gameId, user._id, sanitizedMessage);
    }
    catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  });