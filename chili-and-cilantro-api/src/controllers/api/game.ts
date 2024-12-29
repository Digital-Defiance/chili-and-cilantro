import {
  CardType,
  EndGameReason,
  GamePhase,
  IActionDocument,
  IActionObject,
  IActionResponse,
  IActionsResponse,
  IApiErrorResponse,
  IChefDocument,
  IEndGameActionDocument,
  IEndGameActionObject,
  IGameActionResponse,
  IGameChefResponse,
  IGameChefsHistoryResponse,
  IGameListResponse,
  IGameObject,
  IJoinGameActionDocument,
  IJoinGameActionObject,
  IMessageActionDocument,
  IMessageActionObject,
  IStartGameActionDocument,
  IStartGameActionObject,
  ITurnActionsResponse,
  NotFoundError,
  NotInGameError,
  StringNames,
  TurnAction,
  constants,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ApiRequestHandler,
  IApplication,
  SendFunction,
  handleError,
  routeConfig,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { environment } from '../../environment';
import { ActionService } from '../../services/action';
import { ChefService } from '../../services/chef';
import { GameService } from '../../services/game';
import { PlayerService } from '../../services/player';
import { BaseController } from '../base';

export class GameController extends BaseController {
  private readonly actionService: ActionService;
  private readonly chefService: ChefService;
  private readonly playerService: PlayerService;
  private readonly gameService: GameService;

  constructor(application: IApplication) {
    super(application);
    this.actionService = new ActionService(
      application,
      environment.mongo.useTransactions,
    );
    this.chefService = new ChefService(
      application,
      environment.mongo.useTransactions,
    );
    this.playerService = new PlayerService(
      application,
      environment.mongo.useTransactions,
    );
    this.gameService = new GameService(
      application,
      this.actionService,
      this.chefService,
      this.playerService,
      environment.mongo.useTransactions,
    );
    this.handlers = {
      createGame: this.createGame,
      endGame: this.endGame,
      getAvailableActions: this.getAvailableActions,
      getGame: this.getGame,
      getGameHistory: this.getGameHistory,
      getGames: this.getGames,
      joinGame: this.joinGame,
      performTurnAction: this.performTurnAction,
      sendMessage: this.sendMessage,
      startGame: this.startGame,
    };
  }

  protected initRouteDefinitions(): void {
    this.routeDefinitions = [
      routeConfig<IGameListResponse | IApiErrorResponse, false, Array<unknown>>(
        'get',
        '/list',
        {
          handlerKey: 'getGames',
          useAuthentication: true,
        },
      ),
      routeConfig<IGameChefResponse | IApiErrorResponse, false, Array<unknown>>(
        'post',
        '/create',
        {
          handlerKey: 'createGame',
          useAuthentication: true,
          validation: [
            body('name')
              .isString()
              .trim()
              .notEmpty()
              .matches(constants.GAME_NAME_REGEX)
              .withMessage(
                translate(StringNames.Validation_GameNameRegexErrorTemplate),
              ),
            body('displayname')
              .isString()
              .trim()
              .notEmpty()
              .matches(constants.USER_DISPLAY_NAME_REGEX)
              .withMessage(
                translate(StringNames.Validation_DisplayNameRegexErrorTemplate),
              ),
            body('password')
              .optional()
              .isString()
              .trim()
              .matches(constants.GAME_PASSWORD_REGEX)
              .withMessage(
                translate(
                  StringNames.Validation_GamePasswordRegexErrorTemplate,
                ),
              ),
            body('maxChefs').isInt({
              min: constants.MIN_CHEFS,
              max: constants.MAX_CHEFS,
            }),
          ],
        },
      ),
      routeConfig<
        IGameChefsHistoryResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >('post', '/:code/join', {
        handlerKey: 'joinGame',
        useAuthentication: true,
        validation: [
          body('password')
            .optional()
            .isString()
            .trim()
            .matches(constants.GAME_PASSWORD_REGEX)
            .withMessage(
              translate(StringNames.Validation_GamePasswordRegexErrorTemplate),
            ),
          body('displayname')
            .isString()
            .trim()
            .notEmpty()
            .matches(constants.USER_DISPLAY_NAME_REGEX)
            .withMessage(
              translate(StringNames.Validation_DisplayNameRegexErrorTemplate),
            ),
        ],
      }),
      routeConfig<
        IActionResponse<IMessageActionDocument> | IApiErrorResponse,
        false,
        Array<unknown>
      >('post', '/:code/message', {
        handlerKey: 'sendMessage',
        useAuthentication: true,
        validation: [body('message').isString().trim().notEmpty()],
      }),
      routeConfig<IActionsResponse | IApiErrorResponse, false, Array<unknown>>(
        'get',
        '/:code/history',
        {
          handlerKey: 'getGameHistory',
          useAuthentication: true,
        },
      ),
      routeConfig<
        IGameActionResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >('post', '/:code/start', {
        handlerKey: 'startGame',
        useAuthentication: true,
      }),
      routeConfig<
        IGameActionResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >('post', '/:code/end', {
        handlerKey: 'endGame',
        useAuthentication: true,
        validation: [
          body('reason').isString().isIn(Object.values(EndGameReason)),
        ],
      }),
      routeConfig<
        ITurnActionsResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >('get', '/:code/action', {
        handlerKey: 'getAvailableActions',
        useAuthentication: true,
      }),
      routeConfig<
        IGameChefsHistoryResponse | IApiErrorResponse,
        false,
        Array<unknown>
      >('get', '/:code', {
        handlerKey: 'getGame',
        useAuthentication: true,
      }),
      routeConfig<IGameChefResponse | IApiErrorResponse, false, Array<unknown>>(
        'post',
        '/:code/action',
        {
          handlerKey: 'performTurnAction',
          useAuthentication: true,
          validation: [
            body('action').isString().isIn(Object.values(TurnAction)),
            body('cardType')
              .optional()
              .isString()
              .isIn(Object.values(CardType)),
          ],
        },
      ),
    ];
  }

  /**
   * Creates a new game.
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private createGame: ApiRequestHandler<IGameChefResponse | IApiErrorResponse> =
    async (
      req: Request,
      res: Response<IGameChefResponse>,
      send: SendFunction<IGameChefResponse | IApiErrorResponse>,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const user = await this.validateAndFetchRequestUser(req, res, next);
        const { name, displayname, password, maxChefs } = req.validatedBody;
        const sanitizedName = (name as string)?.trim();
        const sanitizedDisplayName = (displayname as string)
          ?.trim()
          .toLowerCase();
        const sanitizedPassword = (password as string)?.trim();
        const sanitizedMaxChefs = parseInt(maxChefs, 10);

        const { game, chef } = await this.gameService.performCreateGameAsync(
          user,
          sanitizedDisplayName,
          sanitizedName,
          sanitizedMaxChefs,
          sanitizedPassword,
        );
        send(
          201,
          {
            message: translate(StringNames.Game_CreateGameSuccess),
            game: GameService.gameToGameObject(game),
            chef: ChefService.chefToChefObject(chef),
          },
          res,
        );
      } catch (error) {
        handleError(error, res, send as SendFunction<IApiErrorResponse>, next);
      }
    };

  /**
   * Joins a game
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private joinGame: ApiRequestHandler<
    IGameChefsHistoryResponse | IApiErrorResponse
  > = async (
    req: Request,
    res: Response,
    send: SendFunction<IGameChefsHistoryResponse | IApiErrorResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const { displayname, password } = req.validatedBody;
      const gameCode = req.params.code;
      const sanitizedDisplayName = (displayname as string)?.trim();
      const sanitizedPassword = (password as string)?.trim();

      const { game, chefs, history } =
        await this.gameService.performJoinGameAsync(
          gameCode,
          sanitizedPassword,
          user,
          sanitizedDisplayName,
        );
      send(
        200,
        {
          message: translate(StringNames.Game_JoinGameSuccess),
          game: GameService.gameToGameObject(game),
          chefs: chefs.map((c) => ChefService.chefToChefObject(c)),
          history: history.map((a) =>
            ActionService.actionToActionObject<
              IJoinGameActionDocument,
              IJoinGameActionObject
            >(a),
          ),
        },
        res,
      );
    } catch (error) {
      handleError(error, res, send as SendFunction<IApiErrorResponse>, next);
    }
  };

  /**
   * Send a message to game chat
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private sendMessage: ApiRequestHandler<
    IActionResponse<IMessageActionObject> | IApiErrorResponse
  > = async (
    req: Request,
    res: Response,
    send: SendFunction<
      IActionResponse<IMessageActionObject> | IApiErrorResponse
    >,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const { message } = req.validatedBody;
      const gameCode = req.params.code;
      const sanitizedMessage = (message as string)?.trim();
      const messageAction = await this.gameService.performSendMessageAsync(
        gameCode,
        user,
        sanitizedMessage,
      );
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          action: ActionService.actionToActionObject<
            IMessageActionDocument,
            IMessageActionObject
          >(messageAction),
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  };

  /**
   * Gets the history of the game
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private getGameHistory: ApiRequestHandler<
    IActionsResponse | IApiErrorResponse
  > = async (
    req: Request,
    res: Response,
    send: SendFunction<IActionsResponse | IApiErrorResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const isParticipant = await this.gameService.verifyUserIsParticipantAsync(
        req.user.id,
        gameCode,
      );
      if (!isParticipant) {
        send(
          403,
          {
            message: translate(StringNames.Error_NotInGame),
            error: new NotInGameError(403),
          },
          res,
        );
        return;
      }
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
      );
      if (
        game.currentPhase === GamePhase.GAME_OVER &&
        new Date().getTime() >
          game.dateEnded.getTime() +
            constants.MAX_GAME_HISTORY_AGE_IN_HOURS * 60 * 60 * 1000
      ) {
        send(
          404,
          {
            message: translate(StringNames.Error_NotFound),
            error: new NotFoundError(),
          },
          res,
        );
        return;
      }
      const actions = await this.actionService.getGameHistoryAsync(game);
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          actions: actions.map((a) =>
            ActionService.actionToActionObject<IActionDocument, IActionObject>(
              a,
            ),
          ),
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  };

  /**
   * Starts a game
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private startGame: ApiRequestHandler<
    IGameActionResponse | IApiErrorResponse
  > = async (
    req: Request,
    res: Response,
    send: SendFunction<
      | IGameActionResponse<IGameObject, IStartGameActionObject>
      | IApiErrorResponse
    >,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const { game, action } = await this.gameService.performStartGameAsync(
        gameCode,
        user._id,
      );
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          action: ActionService.actionToActionObject<
            IStartGameActionDocument,
            IStartGameActionObject
          >(action),
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  };

  /**
   * Gets the available actions for the current turn
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private getAvailableActions: ApiRequestHandler<
    ITurnActionsResponse | IApiErrorResponse
  > = async (
    req: Request,
    res: Response,
    send: SendFunction<ITurnActionsResponse | IApiErrorResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
      );
      const chef = await this.chefService.getGameChefOrThrowAsync(game, user);
      const actions = this.gameService.availableTurnActions(game, chef);
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          actions,
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  };

  /**
   * Performs a turn action for the specified game
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns
   */
  private performTurnAction: ApiRequestHandler<
    IGameChefResponse | IApiErrorResponse
  > = async (
    req: Request,
    res: Response,
    send: SendFunction<IGameChefResponse | IApiErrorResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.validateAndFetchRequestUser(req, res, next);
      const gameCode = req.params.code;
      const { action, ingredient, bid } = req.validatedBody;
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
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          chef: ChefService.chefToChefObject(chef),
        },
        res,
      );
    } catch (e) {
      handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
    }
  };

  /**
   * Gets all games created and participating for the current user
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns The response
   */
  private getGames: ApiRequestHandler<IGameListResponse | IApiErrorResponse> =
    async (
      req: Request,
      res: Response,
      send: SendFunction<IGameListResponse | IApiErrorResponse>,
      next: NextFunction,
    ): Promise<void> => {
      try {
        return this.withTransaction<void>(async (session) => {
          const user = await this.validateAndFetchRequestUser(req, res, next);
          const gameResponse: IGameListResponse =
            await this.gameService.getGamesAsync(user, session, true);
          send(200, gameResponse, res);
        });
      } catch (e) {
        handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
      }
    };

  /**
   * Gets a game by code, user must be a participant
   * @param req The request
   * @param res The response
   * @param send The send function
   * @param next The next function
   * @returns The response
   */
  private getGame: ApiRequestHandler<
    IGameChefsHistoryResponse | IApiErrorResponse
  > = async (
    req: Request,
    res: Response,
    send: SendFunction<IGameChefsHistoryResponse | IApiErrorResponse>,
    next: NextFunction,
  ): Promise<void> => {
    return this.withTransaction<void>(async (session) => {
      const gameCode = req.params.code;
      const isParticipant = await this.gameService.verifyUserIsParticipantAsync(
        req.user.id,
        gameCode,
      );
      if (!isParticipant) {
        send(
          403,
          {
            message: translate(StringNames.Error_NotInGame),
            error: new NotInGameError(403),
          },
          res,
        );
        return;
      }
      const game = await this.gameService.getGameByCodeOrThrowAsync(
        gameCode,
        true,
        session,
      );
      const chefs: IChefDocument[] =
        await this.chefService.getGameChefsByGameOrIdAsync(game, session);
      const history: IActionDocument[] =
        await this.gameService.getGameHistoryAsync(game._id, session);
      send(
        200,
        {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          chefs: chefs.map((c) => ChefService.chefToChefObject(c)),
          history: history.map((a) =>
            ActionService.actionToActionObject<IActionDocument, IActionObject>(
              a,
            ),
          ),
        },
        res,
      );
    });
  };

  private endGame: ApiRequestHandler<IGameActionResponse | IApiErrorResponse> =
    async (
      req: Request,
      res: Response,
      send: SendFunction<IGameActionResponse | IApiErrorResponse>,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const user = await this.validateAndFetchRequestUser(req, res, next);
        const gameCode = req.params.code;
        const reason = req.validatedBody.reason as EndGameReason;
        const { game, action } = await this.gameService.performEndGameAsync(
          gameCode,
          reason,
          user._id,
        );
        send(
          200,
          {
            message: translate(StringNames.Common_Success),
            game: GameService.gameToGameObject(game),
            action: ActionService.actionToActionObject<
              IEndGameActionDocument,
              IEndGameActionObject
            >(action),
          },
          res,
        );
      } catch (e) {
        handleError(e, res, send as SendFunction<IApiErrorResponse>, next);
      }
    };
}
