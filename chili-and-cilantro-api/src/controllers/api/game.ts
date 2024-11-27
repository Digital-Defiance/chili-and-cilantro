import {
  CardType,
  IUserDocument,
  ModelName,
  TurnAction,
  UserNotFoundError,
  ValidationError,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  IApplication,
  RouteConfig,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Request, Response } from 'express';
import { InvalidTokenError } from 'express-oauth2-jwt-bearer';
import { body } from 'express-validator';
import { ActionService } from '../../services/action';
import { ChefService } from '../../services/chef';
import { GameService } from '../../services/game';
import { PlayerService } from '../../services/player';
import { BaseController } from '../base';

export class GameController extends BaseController {
  private readonly actionService;
  private readonly chefService;
  private readonly playerService;
  private readonly gameService;

  constructor(application: IApplication) {
    super(application.getModel);
    this.actionService = new ActionService(application);
    this.chefService = new ChefService(application.getModel);
    this.playerService = new PlayerService(application.getModel);
    this.gameService = new GameService(
      application.getModel,
      this.actionService,
      this.chefService,
      this.playerService,
    );
  }

  protected getRoutes(): RouteConfig[] {
    return [
      {
        method: 'post',
        path: '/create',
        handler: this.createGame,
        useAuthentication: true,
        validation: [
          body('name').isString().trim().notEmpty(),
          body('userName').isString().trim().notEmpty(),
          body('password').optional().isString().trim(),
          body('maxChefs').isInt({ min: 2, max: 8 }),
        ],
      },
      {
        method: 'post',
        path: '/:code/join',
        handler: this.joinGame,
        useAuthentication: true,
        validation: [
          body('userName').isString().trim().notEmpty(),
          body('password').optional().isString().trim(),
        ],
      },
      {
        method: 'post',
        path: '/:code/message',
        handler: this.sendMessage,
        useAuthentication: true,
        validation: [body('message').isString().trim().notEmpty()],
      },
      {
        method: 'get',
        path: '/:code/history',
        handler: this.getGameHistory,
        useAuthentication: true,
      },
      {
        method: 'post',
        path: '/:code/start',
        handler: this.startGame,
        useAuthentication: true,
      },
      {
        method: 'get',
        path: '/:code/action',
        handler: this.getAvailableActions,
        useAuthentication: true,
      },
      {
        method: 'post',
        path: '/:code/action',
        handler: this.performTurnAction,
        useAuthentication: true,
        validation: [
          body('action').isString().isIn(Object.values(TurnAction)),
          body('cardType').optional().isString().isIn(Object.values(CardType)),
        ],
      },
    ];
  }

  /**
   * Creates a new game.
   * @param req
   * @param res
   * @returns
   */
  private async createGame(req: Request, res: Response) {
    const UserModel = this.getModel<IUserDocument>(ModelName.User);
    try {
      if (!req.user) {
        this.sendApiErrorResponse(
          401,
          'Invalid token',
          new InvalidTokenError(),
          res,
        );
        return;
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        this.sendApiErrorResponse(
          500,
          'User not found',
          new UserNotFoundError(),
          res,
        );
        return;
      }
      const { name, userName, password, maxChefs } = req.body;
      const sanitizedName = (name as string)?.trim();
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim();
      const sanitizedMaxChefs = parseInt(maxChefs, 10);

      const { game, chef } = await this.gameService.performCreateGameAsync(
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
        this.sendApiErrorResponse(500, 'An error occurred', error, res);
      }
    }
  }

  /**
   * Joins a game
   * @param req
   * @param res
   * @returns
   */
  private async joinGame(req: Request, res: Response) {
    const UserModel = this.getModel<IUserDocument>(ModelName.User);
    try {
      if (!req.user) {
        this.sendApiErrorResponse(
          401,
          'Invalid token',
          new InvalidTokenError(),
          res,
        );
        return;
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        this.sendApiErrorResponse(
          500,
          'User not found',
          new UserNotFoundError(),
          res,
        );
        return;
      }
      const { userName, password } = req.body;
      const gameCode = req.params.code;
      const sanitizedUserName = (userName as string)?.trim();
      const sanitizedPassword = (password as string)?.trim();

      const { game, chef } = await this.gameService.performJoinGameAsync(
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
  }

  /**
   * Send a message to game chat
   * @param req
   * @param res
   * @returns
   */
  private async sendMessage(req: Request, res: Response) {
    const UserModel = this.getModel<IUserDocument>(ModelName.User);
    try {
      if (!req.user) {
        this.sendApiErrorResponse(
          401,
          'Invalid token',
          new InvalidTokenError(),
          res,
        );
        return;
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        this.sendApiErrorResponse(
          500,
          'User not found',
          new UserNotFoundError(),
          res,
        );
        return;
      }
      const { message } = req.body;
      const gameCode = req.params.code;
      const sanitizedMessage = (message as string)?.trim();
      const messageAction = await this.gameService.performSendMessageAsync(
        gameCode,
        user,
        sanitizedMessage,
      );
      res.status(200).json(messageAction);
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        this.sendApiErrorResponse(500, 'An error occurred', e, res);
      }
    }
  }

  /**
   * Gets the history of the game
   * @param req
   * @param res
   * @returns
   */
  private async getGameHistory(req: Request, res: Response) {
    const UserModel = this.getModel<IUserDocument>(ModelName.User);
    try {
      if (!req.user) {
        this.sendApiErrorResponse(
          401,
          'Invalid token',
          new InvalidTokenError(),
          res,
        );
        return;
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        this.sendApiErrorResponse(
          500,
          'User not found',
          new UserNotFoundError(),
          res,
        );
        return;
      }
      const gameCode = req.params.code;
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
      );
      const actions = await this.actionService.getGameHistoryAsync(game);
      res.status(200).json(actions);
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        this.sendApiErrorResponse(500, 'An error occurred', e, res);
      }
    }
  }

  /**
   * Starts a game
   * @param req
   * @param res
   * @returns
   */
  private async startGame(req: Request, res: Response) {
    const UserModel = this.getModel<IUserDocument>(ModelName.User);
    try {
      if (!req.user) {
        this.sendApiErrorResponse(
          401,
          'Invalid token',
          new InvalidTokenError(),
          res,
        );
        return;
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        this.sendApiErrorResponse(
          500,
          'User not found',
          new UserNotFoundError(),
          res,
        );
        return;
      }
      const gameCode = req.params.code;
      const { game, action } = await this.gameService.performStartGameAsync(
        gameCode,
        user._id,
      );
      res.status(200).json({ game, action });
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        this.sendApiErrorResponse(500, 'An error occurred', e, res);
      }
    }
  }

  /**
   * Gets the available actions for the current turn
   * @param req
   * @param res
   * @returns
   */
  private async getAvailableActions(req: Request, res: Response) {
    const UserModel = this.getModel<IUserDocument>(ModelName.User);
    try {
      if (!req.user) {
        this.sendApiErrorResponse(
          401,
          'Invalid token',
          new InvalidTokenError(),
          res,
        );
        return;
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        this.sendApiErrorResponse(
          500,
          'User not found',
          new UserNotFoundError(),
          res,
        );
        return;
      }
      const gameCode = req.params.code;
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
      );
      const chef = await this.chefService.getGameChefOrThrowAsync(game, user);
      const actions = this.gameService.availableTurnActions(game, chef);
      res.status(200).json(actions);
    } catch (e) {
      if (e instanceof ValidationError) {
        res.status(400).json(e);
      } else {
        this.sendApiErrorResponse(500, 'An error occurred', e, res);
      }
    }
  }

  /**
   * Performs a turn action for the specified game
   * @param req
   * @param res
   * @returns
   */
  private async performTurnAction(req: Request, res: Response) {
    const UserModel = this.getModel<IUserDocument>(ModelName.User);
    try {
      if (!req.user) {
        this.sendApiErrorResponse(
          401,
          'Invalid token',
          new InvalidTokenError(),
          res,
        );
        return;
      }
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        this.sendApiErrorResponse(
          500,
          'User not found',
          new UserNotFoundError(),
          res,
        );
        return;
      }
      const gameCode = req.params.code;
      const { action, ingredient, bid } = req.body;
      const actionArgs = {
        ...(ingredient ? { ingredient: ingredient as CardType } : {}),
        ...(bid ? { bid: bid as number } : {}),
      };
      const { game, chef } = await this.gameService.performTurnActionAsync(
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
        this.sendApiErrorResponse(500, 'An error occurred', e, res);
      }
    }
  }
}
