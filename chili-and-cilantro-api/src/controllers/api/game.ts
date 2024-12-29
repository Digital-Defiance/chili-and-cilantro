import {
  CardType,
  EndGameReason,
  GamePhase,
  IActionDocument,
  IActionObject,
  IActionResponse,
  IActionsResponse,
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
  ApiErrorResponse,
  ApiRequestHandler,
  IApplication,
  IStatusCodeResponse,
  TypedHandlers,
  routeConfig,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Request } from 'express';
import { body } from 'express-validator';
import { environment } from '../../environment';
import { ActionService } from '../../services/action';
import { ChefService } from '../../services/chef';
import { GameService } from '../../services/game';
import { PlayerService } from '../../services/player';
import { BaseController } from '../base';

interface IGamesHandlers extends TypedHandlers<any> {
  createGame: ApiRequestHandler<IGameChefResponse | ApiErrorResponse>;
  endGame: ApiRequestHandler<IGameActionResponse | ApiErrorResponse>;
  getAvailableActions: ApiRequestHandler<
    ITurnActionsResponse | ApiErrorResponse
  >;
  getGame: ApiRequestHandler<IGameChefsHistoryResponse | ApiErrorResponse>;
  getGameHistory: ApiRequestHandler<IActionsResponse | ApiErrorResponse>;
  getGames: ApiRequestHandler<IGameListResponse | ApiErrorResponse>;
  joinGame: ApiRequestHandler<IGameChefsHistoryResponse | ApiErrorResponse>;
  performTurnAction: ApiRequestHandler<IGameChefResponse | ApiErrorResponse>;
  sendMessage: ApiRequestHandler<
    IActionResponse<IMessageActionObject> | ApiErrorResponse
  >;
  startGame: ApiRequestHandler<IGameActionResponse | ApiErrorResponse>;
}

export class GameController extends BaseController<any, IGamesHandlers> {
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
      routeConfig<IGameListResponse | ApiErrorResponse, IGamesHandlers>(
        'get',
        '/list',
        {
          handlerKey: 'getGames',
          useAuthentication: true,
        },
      ),
      routeConfig<IGameChefResponse | ApiErrorResponse, IGamesHandlers>(
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
      routeConfig<IGameChefsHistoryResponse | ApiErrorResponse, IGamesHandlers>(
        'post',
        '/:code/join',
        {
          handlerKey: 'joinGame',
          useAuthentication: true,
          validation: [
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
            body('displayname')
              .isString()
              .trim()
              .notEmpty()
              .matches(constants.USER_DISPLAY_NAME_REGEX)
              .withMessage(
                translate(StringNames.Validation_DisplayNameRegexErrorTemplate),
              ),
          ],
        },
      ),
      routeConfig<
        IActionResponse<IMessageActionDocument> | ApiErrorResponse,
        IGamesHandlers
      >('post', '/:code/message', {
        handlerKey: 'sendMessage',
        useAuthentication: true,
        validation: [body('message').isString().trim().notEmpty()],
      }),
      routeConfig<IActionsResponse | ApiErrorResponse, IGamesHandlers>(
        'get',
        '/:code/history',
        {
          handlerKey: 'getGameHistory',
          useAuthentication: true,
        },
      ),
      routeConfig<IGameActionResponse | ApiErrorResponse, IGamesHandlers>(
        'post',
        '/:code/start',
        {
          handlerKey: 'startGame',
          useAuthentication: true,
        },
      ),
      routeConfig<IGameActionResponse | ApiErrorResponse, IGamesHandlers>(
        'post',
        '/:code/end',
        {
          handlerKey: 'endGame',
          useAuthentication: true,
          validation: [
            body('reason').isString().isIn(Object.values(EndGameReason)),
          ],
        },
      ),
      routeConfig<ITurnActionsResponse | ApiErrorResponse, IGamesHandlers>(
        'get',
        '/:code/action',
        {
          handlerKey: 'getAvailableActions',
          useAuthentication: true,
        },
      ),
      routeConfig<IGameChefsHistoryResponse | ApiErrorResponse, IGamesHandlers>(
        'get',
        '/:code',
        {
          handlerKey: 'getGame',
          useAuthentication: true,
        },
      ),
      routeConfig<IGameChefResponse | ApiErrorResponse, IGamesHandlers>(
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
   * @returns
   */
  private createGame: ApiRequestHandler<IGameChefResponse | ApiErrorResponse> =
    async (
      req: Request,
    ): Promise<IStatusCodeResponse<IGameChefResponse | ApiErrorResponse>> => {
      const user = await this.validateAndFetchRequestUser(req);
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
      return {
        statusCode: 201,
        response: {
          message: translate(StringNames.Game_CreateGameSuccess),
          game: GameService.gameToGameObject(game),
          chef: ChefService.chefToChefObject(chef),
        },
      };
    };

  /**
   * Joins a game
   * @param req The request
   * @returns
   */
  private joinGame: ApiRequestHandler<
    IGameChefsHistoryResponse | ApiErrorResponse
  > = async (
    req: Request,
  ): Promise<
    IStatusCodeResponse<IGameChefsHistoryResponse | ApiErrorResponse>
  > => {
    const user = await this.validateAndFetchRequestUser(req);
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
    return {
      statusCode: 200,
      response: {
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
    };
  };

  /**
   * Send a message to game chat
   * @param req The request
   * @returns
   */
  private sendMessage: ApiRequestHandler<
    IActionResponse<IMessageActionObject> | ApiErrorResponse
  > = async (
    req: Request,
  ): Promise<
    IStatusCodeResponse<
      IActionResponse<IMessageActionObject> | ApiErrorResponse
    >
  > => {
    const user = await this.validateAndFetchRequestUser(req);
    const { message } = req.validatedBody;
    const gameCode = req.params.code;
    const sanitizedMessage = (message as string)?.trim();
    const messageAction = await this.gameService.performSendMessageAsync(
      gameCode,
      user,
      sanitizedMessage,
    );
    return {
      statusCode: 200,
      response: {
        message: translate(StringNames.Common_Success),
        action: ActionService.actionToActionObject<
          IMessageActionDocument,
          IMessageActionObject
        >(messageAction),
      },
    };
  };

  /**
   * Gets the history of the game
   * @param req The request
   * @returns
   */
  private getGameHistory: ApiRequestHandler<
    IActionsResponse | ApiErrorResponse
  > = async (
    req: Request,
  ): Promise<IStatusCodeResponse<IActionsResponse | ApiErrorResponse>> => {
    await this.validateAndFetchRequestUser(req);
    const gameCode = req.params.code;
    const isParticipant = await this.gameService.verifyUserIsParticipantAsync(
      req.user.id,
      gameCode,
    );
    if (!isParticipant) {
      return {
        statusCode: 403,
        response: {
          message: translate(StringNames.Error_NotInGame),
          error: new NotInGameError(403),
        },
      };
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
      return {
        statusCode: 404,
        response: {
          message: translate(StringNames.Error_NotFound),
          error: new NotFoundError(),
        },
      };
    }
    const actions = await this.actionService.getGameHistoryAsync(game);
    return {
      statusCode: 200,
      response: {
        message: translate(StringNames.Common_Success),
        actions: actions.map((a) =>
          ActionService.actionToActionObject<IActionDocument, IActionObject>(a),
        ),
      },
    };
  };

  /**
   * Starts a game
   * @param req The request
   * @returns
   */
  private startGame: ApiRequestHandler<IGameActionResponse | ApiErrorResponse> =
    async (
      req: Request,
    ): Promise<
      IStatusCodeResponse<
        | IGameActionResponse<IGameObject, IStartGameActionObject>
        | ApiErrorResponse
      >
    > => {
      const user = await this.validateAndFetchRequestUser(req);
      const gameCode = req.params.code;
      const { game, action } = await this.gameService.performStartGameAsync(
        gameCode,
        user._id,
      );
      return {
        statusCode: 200,
        response: {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          action: ActionService.actionToActionObject<
            IStartGameActionDocument,
            IStartGameActionObject
          >(action),
        },
      };
    };

  /**
   * Gets the available actions for the current turn
   * @param req The request
   * @returns
   */
  private getAvailableActions: ApiRequestHandler<
    ITurnActionsResponse | ApiErrorResponse
  > = async (
    req: Request,
  ): Promise<IStatusCodeResponse<ITurnActionsResponse | ApiErrorResponse>> => {
    const user = await this.validateAndFetchRequestUser(req);
    const gameCode = req.params.code;
    const game = await this.gameService.getGameByCodeOrThrowAsync(
      gameCode,
      true,
    );
    const chef = await this.chefService.getGameChefOrThrowAsync(game, user);
    const actions = this.gameService.availableTurnActions(game, chef);
    return {
      statusCode: 200,
      response: {
        message: translate(StringNames.Common_Success),
        actions,
      },
    };
  };

  /**
   * Performs a turn action for the specified game
   * @param req The request
   * @returns
   */
  private performTurnAction: ApiRequestHandler<
    IGameChefResponse | ApiErrorResponse
  > = async (
    req: Request,
  ): Promise<IStatusCodeResponse<IGameChefResponse | ApiErrorResponse>> => {
    const user = await this.validateAndFetchRequestUser(req);
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
    return {
      statusCode: 200,
      response: {
        message: translate(StringNames.Common_Success),
        game: GameService.gameToGameObject(game),
        chef: ChefService.chefToChefObject(chef),
      },
    };
  };

  /**
   * Gets all games created and participating for the current user
   * @param req The request
   * @returns The response
   */
  private getGames: ApiRequestHandler<IGameListResponse | ApiErrorResponse> =
    async (
      req: Request,
    ): Promise<IStatusCodeResponse<IGameListResponse | ApiErrorResponse>> => {
      return await this.withTransaction<IStatusCodeResponse<IGameListResponse>>(
        async (session) => {
          const user = await this.validateAndFetchRequestUser(req);
          const gameResponse: IGameListResponse =
            await this.gameService.getGamesAsync(user, session, true);
          return { statusCode: 200, response: gameResponse };
        },
      );
    };

  /**
   * Gets a game by code, user must be a participant
   * @param req The request
   * @returns The response
   */
  private getGame: ApiRequestHandler<
    IGameChefsHistoryResponse | ApiErrorResponse
  > = async (
    req: Request,
  ): Promise<
    IStatusCodeResponse<IGameChefsHistoryResponse | ApiErrorResponse>
  > => {
    return this.withTransaction<
      IStatusCodeResponse<IGameChefsHistoryResponse | ApiErrorResponse>
    >(async (session) => {
      const gameCode = req.params.code;
      const isParticipant = await this.gameService.verifyUserIsParticipantAsync(
        req.user.id,
        gameCode,
      );
      if (!isParticipant) {
        return {
          statusCode: 403,
          response: {
            message: translate(StringNames.Error_NotInGame),
            error: new NotInGameError(403),
          },
        };
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
      return {
        statusCode: 200,
        response: {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          chefs: chefs.map((c) => ChefService.chefToChefObject(c)),
          history: history.map((a) =>
            ActionService.actionToActionObject<IActionDocument, IActionObject>(
              a,
            ),
          ),
        },
      };
    });
  };

  /**
   * Ends a game
   * @param req The request
   */
  private endGame: ApiRequestHandler<IGameActionResponse | ApiErrorResponse> =
    async (
      req: Request,
    ): Promise<IStatusCodeResponse<IGameActionResponse | ApiErrorResponse>> => {
      const user = await this.validateAndFetchRequestUser(req);
      const gameCode = req.params.code;
      const reason = req.validatedBody.reason as EndGameReason;
      const { game, action } = await this.gameService.performEndGameAsync(
        gameCode,
        reason,
        user._id,
      );
      return {
        statusCode: 200,
        response: {
          message: translate(StringNames.Common_Success),
          game: GameService.gameToGameObject(game),
          action: ActionService.actionToActionObject<
            IEndGameActionDocument,
            IEndGameActionObject
          >(action),
        },
      };
    };
}
