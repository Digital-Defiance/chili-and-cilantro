import { Request, Response, Router } from 'express';
import { validateAccessToken } from '../middlewares/auth0';
import { GameService } from '../services/gameService';
import { JwtService } from '../services/jwtService';
import validator from 'validator';
import { FirstChef } from '@chili-and-cilantro/chili-and-cilantro-lib';
import constants from '../constants';
import { Database } from '../services/database';

export const gamesRouter = Router();

gamesRouter.post('/create', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedToken(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const { name, userName, password, maxChefs, firstChef } = req.body;
      const sanitizedName = (name as string)?.trim();
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim().toLowerCase();
      const sanitizedMaxChefs = parseInt(maxChefs, 10);
      const sanitizedFirstChef: FirstChef = firstChef as FirstChef;
      if (!validator.matches(sanitizedName, constants.MULTILINGUAL_STRING_REGEX) || sanitizedName.length < 2 || sanitizedName.length > constants.MAX_GAME_NAME_LENGTH) {
        return res.status(400).json({ message: 'Invalid name' });
      }
      if (!validator.matches(sanitizedUserName, constants.MULTILINGUAL_STRING_REGEX) || sanitizedUserName.length < constants.MIN_USER_NAME_LENGTH || sanitizedUserName.length > constants.MAX_USER_NAME_LENGTH) {
        return res.status(400).json({ message: 'Invalid user name' });
      }
      if (sanitizedPassword.length > 0 && (!validator.matches(sanitizedPassword, constants.MULTILINGUAL_STRING_REGEX) || sanitizedPassword.length < constants.MIN_GAME_PASSWORD_LENGTH || sanitizedPassword.length > constants.MAX_GAME_PASSWORD_LENGTH)) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      if (sanitizedMaxChefs < 2 || sanitizedMaxChefs > constants.MAX_CHEFS) {
        return res.status(400).json({ message: 'Invalid max chefs' });
      }
      if (!sanitizedFirstChef || !Object.values(FirstChef).includes(sanitizedFirstChef)) {
        return res.status(400).json({ message: 'Invalid first chef' });
      }

      const database = new Database();
      const gameService = new GameService(database);
      const { game, chef } = await gameService.createGameAsync(user, sanitizedUserName, sanitizedName, sanitizedPassword, sanitizedMaxChefs, sanitizedFirstChef);
      res.send({ game, chef });
    }
    catch (error) {
      res.status(400).json(error);
    }
  });

gamesRouter.post('/join', validateAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      const user = await jwtService.getUserFromValidatedToken(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      const { gameId, userName, password } = req.body;
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim().toLowerCase();
      if (sanitizedPassword.length > 0 && !validator.matches(sanitizedPassword, constants.MULTILINGUAL_STRING_REGEX)) {
        return res.status(400).json({ message: 'Invalid password' });
      }
      if (!validator.matches(sanitizedUserName, constants.MULTILINGUAL_STRING_REGEX) || sanitizedUserName.length < constants.MIN_USER_NAME_LENGTH || sanitizedUserName.length > constants.MAX_USER_NAME_LENGTH) {
        return res.status(400).json({ message: 'Invalid user name' });
      }

      const database = new Database();
      const gameService = new GameService(database);
      const { game, chef } = await gameService.joinGameAsync(gameId, sanitizedPassword, user, sanitizedUserName);
      res.send({ game, chef });
    }
    catch (error) {
      res.status(400).json(error);
    }
  });