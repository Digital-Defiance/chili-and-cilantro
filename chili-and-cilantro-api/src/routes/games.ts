import {
  CardType,
  TurnAction,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Request, Response, Router } from 'express';
import { ValidationError } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ActionService } from '../services/action';
import { ChefService } from '../services/chef';
import { GameService } from '../services/game';
import { JwtService } from '../services/jwt';
import { PlayerService } from '../services/player';
import { UserService } from '../services/user';
import { authenticateToken } from '../middlewares/authenticate-token';
import { UserModel } from '@chili-and-cilantro/chili-and-cilantro-node-lib';

export const gamesRouter = Router();

gamesRouter.post(
  '/create',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userService = new UserService();
      const jwtService = new JwtService();
      if (!req.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      const { name, userName, password, maxChefs } = req.body;
      const sanitizedName = (name as string)?.trim();
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim();
      const sanitizedMaxChefs = parseInt(maxChefs, 10);

      const actionService = new ActionService();
      const chefService = new ChefService();
      const playerService = new PlayerService();
      const gameService = new GameService(
        actionService,
        chefService,
        playerService,
      );
      const { game, chef } = await gameService.performCreateGameAsync(
        user,
        sanitizedUserName,
        sanitizedName,
        sanitizedPassword,
        sanitizedMaxChefs,
      );
      res.send({ game, chef });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  },
);

gamesRouter.post(
  '/:code/join',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userService = new UserService();
      const jwtService = new JwtService();
      if (!req.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      const { userName, password } = req.body;
      const gameCode = req.params.code;
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim();

      const actionService = new ActionService();
      const chefService = new ChefService();
      const playerService = new PlayerService();
      const gameService = new GameService(
        actionService,
        chefService,
        playerService,
      );
      const { game, chef } = await gameService.performJoinGameAsync(
        gameCode,
        sanitizedPassword,
        user,
        sanitizedUserName,
      );
      res.send({ game, chef });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
    }
  },
);

gamesRouter.post(
  '/:code/message',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userService = new UserService();
      const jwtService = new JwtService();
      if (!req.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      const { message } = req.body;
      const gameCode = req.params.code;
      const sanitizedMessage = (message as string)?.trim();
      const actionService = new ActionService();
      const chefService = new ChefService();
      const playerService = new PlayerService();
      const gameService = new GameService(
        actionService,
        chefService,
        playerService,
      );
      const messageAction = await gameService.performSendMessageAsync(
        gameCode,
        user,
        sanitizedMessage,
      );
      res.status(200).json(messageAction);
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  },
);

gamesRouter.get(
  '/:code/history',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userService = new UserService();
      const jwtService = new JwtService();
      if (!req.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const actionService = new ActionService();
      const chefService = new ChefService();
      const playerService = new PlayerService();
      const gameService = new GameService(
        actionService,
        chefService,
        playerService,
      );
      const game = await gameService.getGameByCodeOrThrowAsync(gameCode, true);
      const actions = await actionService.getGameHistoryAsync(game);
      res.status(200).json(actions);
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  },
);

gamesRouter.post(
  '/:code/start',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userService = new UserService();
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      if (!req.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const actionService = new ActionService();
      const chefService = new ChefService();
      const playerService = new PlayerService();
      const gameService = new GameService(
        actionService,
        chefService,
        playerService,
      );
      const { game, action } = await gameService.performStartGameAsync(
        gameCode,
        user._id,
      );
      res.status(200).json({ game, action });
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  },
);

/**
 * Gets the available actions for the specified game and current user
 */
gamesRouter.get(
  '/:code/action',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userService = new UserService();
      const jwtService = new JwtService();
      if (!req.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const actionService = new ActionService();
      const chefService = new ChefService();
      const playerService = new PlayerService();
      const gameService = new GameService(
        actionService,
        chefService,
        playerService,
      );
      const game = await gameService.getGameByCodeOrThrowAsync(gameCode, true);
      const chef = await chefService.getGameChefOrThrowAsync(game, user);
      const actions = await gameService.availableTurnActions(game, chef);
      res.status(200).json(actions);
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  },
);

/**
 * Performs a turn action for the specified game
 */
gamesRouter.post(
  '/:code/action',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userService = new UserService();
      const jwtService = new JwtService();
      const token = req.headers.authorization?.split(' ')[1];
      if (!req.user) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(500).json({ message: 'User not found' });
      }
      const gameCode = req.params.code;
      const { action, ingredient, bid } = req.body;
      const actionArgs = {
        ...(ingredient ? { ingredient: ingredient as CardType } : {}),
        ...(bid ? { bid: bid as number } : {}),
      };
      const actionService = new ActionService();
      const chefService = new ChefService();
      const playerService = new PlayerService();
      const gameService = new GameService(
        actionService,
        chefService,
        playerService,
      );
      const { game, chef } = await gameService.performTurnActionAsync(
        gameCode,
        user,
        action as TurnAction,
        actionArgs,
      );
      res.status(200).json({ game, chef });
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        res.status(500).json(e);
      }
    }
  },
);
