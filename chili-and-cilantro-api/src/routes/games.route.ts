import { Request, Response, Router } from 'express';
import { validateAccessToken } from '../middlewares/auth0';
import { GameService } from '../services/gameService';
import { JwtService } from '../services/jwtService';
import validator from 'validator';

const jwtService = new JwtService();
const gameService = new GameService();

export const gamesRouter = Router();

export const MAX_PLAYERS = 8;
export const MAX_GAME_NAME_LENGTH = 255;

gamesRouter.post('/create', validateAccessToken,
  async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await jwtService.getUserFromValidatedToken(token);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    const { name, password, maxPlayers } = req.body;
    const sanitizedName = (name as string)?.trim();
    const sanitizedPassword = (password as string)?.trim().toLowerCase();
    const sanitizedMaxPlayers = parseInt(maxPlayers, 10);
    if (!validator.isAlphanumeric(name) || sanitizedName.length < 2 || sanitizedName.length > MAX_GAME_NAME_LENGTH) {
      return res.status(400).json({ message: 'Invalid name' });
    }
    if (sanitizedPassword.length > 0 && !validator.isAlphanumeric(sanitizedPassword)) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    if (sanitizedMaxPlayers < 2 || sanitizedMaxPlayers > MAX_PLAYERS) {
      return res.status(400).json({ message: 'Invalid max players' });
    }

    const game = await GameService.createGame(user, sanitizedName, sanitizedPassword, sanitizedMaxPlayers);
  });