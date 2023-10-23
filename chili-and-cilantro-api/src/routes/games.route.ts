import { Request, Response, Router } from 'express';
import { validateAccessToken } from '../middlewares/auth0';
import { GameService, MAX_CHEFS, MAX_GAME_NAME_LENGTH } from '../services/gameService';
import { JwtService } from '../services/jwtService';
import validator from 'validator';
import { FirstChef } from '@chili-and-cilantro/chili-and-cilantro-lib';

const jwtService = new JwtService();
const gameService = new GameService();

export const gamesRouter = Router();

gamesRouter.post('/create', validateAccessToken,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await jwtService.getUserFromValidatedToken(token);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const { name, password, maxChefs, firstChef } = req.body;
    const sanitizedName = (name as string)?.trim();
    const sanitizedPassword = (password as string)?.trim().toLowerCase();
    const sanitizedMaxChefs = parseInt(maxChefs, 10);
    const sanitizedFirstChef: FirstChef = firstChef as FirstChef;
    if (!validator.isAlphanumeric(name) || sanitizedName.length < 2 || sanitizedName.length > MAX_GAME_NAME_LENGTH) {
      return res.status(400).json({ message: 'Invalid name' });
    }
    if (sanitizedPassword.length > 0 && !validator.isAlphanumeric(sanitizedPassword)) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    if (sanitizedMaxChefs < 2 || sanitizedMaxChefs > MAX_CHEFS) {
      return res.status(400).json({ message: 'Invalid max chefs' });
    }
    if (!sanitizedFirstChef || !Object.values(FirstChef).includes(sanitizedFirstChef)) {
      return res.status(400).json({ message: 'Invalid first chef' });
    }

    const game = await gameService.createGame(user, sanitizedName, sanitizedPassword, sanitizedMaxChefs, sanitizedFirstChef);
  });

gamesRouter.post('/join', validateAccessToken,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await jwtService.getUserFromValidatedToken(token);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const { name, password, maxChefs, firstChef } = req.body;
    const sanitizedName = (name as string)?.trim();
    const sanitizedPassword = (password as string)?.trim().toLowerCase();
    if (!validator.isAlphanumeric(name) || sanitizedName.length < 2 || sanitizedName.length > MAX_GAME_NAME_LENGTH) {
      return res.status(400).json({ message: 'Invalid name' });
    }
    if (sanitizedPassword.length > 0 && !validator.isAlphanumeric(sanitizedPassword)) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const game = await gameService.joinGame(user, sanitizedName, sanitizedPassword, sanitizedMaxChefs, sanitizedFirstChef);
  });