import {
  IPusherAppInfoResponse,
  StringNames,
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
import Pusher from 'pusher';
import { environment } from '../../environment';
import { UserService } from '../../services/user';
import { BaseController } from '../base';

interface IPusherHandlers extends TypedHandlers<any> {
  authenticatePusher: ApiRequestHandler<
    Pusher.UserAuthResponse | ApiErrorResponse
  >;
  getAppInfo: ApiRequestHandler<IPusherAppInfoResponse | ApiErrorResponse>;
}

export class PusherController extends BaseController<any, IPusherHandlers> {
  private readonly pusher: Pusher;
  constructor(application: IApplication) {
    super(application);
    this.pusher = new Pusher({
      appId: environment.pusher.appId,
      key: environment.pusher.key,
      secret: environment.pusher.secret,
      cluster: environment.pusher.cluster,
      useTLS: true,
    });
    this.handlers = {
      authenticatePusher: this.authenticatePusher,
      getAppInfo: this.getAppInfo,
    };
  }

  protected initRouteDefinitions(): void {
    this.routeDefinitions = [
      routeConfig<Pusher.UserAuthResponse, IPusherHandlers>('post', '/auth', {
        handlerKey: 'authenticatePusher',
        useAuthentication: true,
        authFailureStatusCode: 403,
        validation: [
          body('socket_id').isString().notEmpty(),
          body('channel_name').isString().notEmpty(),
        ],
        rawJsonHandler: true,
      }),
      routeConfig<IPusherAppInfoResponse, IPusherHandlers>('get', '/appInfo', {
        handlerKey: 'getAppInfo',
        useAuthentication: true,
      }),
    ];
  }

  private getAppInfo: ApiRequestHandler<
    IPusherAppInfoResponse | ApiErrorResponse
  > = async (
    req: Request,
  ): Promise<
    IStatusCodeResponse<IPusherAppInfoResponse | ApiErrorResponse>
  > => {
    if (!req.user) {
      const errorMessage = translate(StringNames.Common_Unauthorized);
      return {
        statusCode: 401,
        response: {
          message: errorMessage,
          error: new Error(errorMessage),
        },
      };
    }
    return {
      statusCode: 200,
      response: {
        message: translate(StringNames.Common_Success),
        appKey: environment.pusher.key,
        cluster: environment.pusher.cluster,
      },
    };
  };

  private authenticatePusher: ApiRequestHandler<
    Pusher.UserAuthResponse | ApiErrorResponse
  > = async (
    req: Request,
  ): Promise<
    IStatusCodeResponse<Pusher.UserAuthResponse | ApiErrorResponse>
  > => {
    const user = await this.validateAndFetchRequestUser(req);
    const socketId = req.validatedBody.socket_id;
    const channel = req.validatedBody.channel_name;

    const presenceData = channel.startsWith('presence-')
      ? {
          user_id: user._id.toString(),
          user_info: { name: user.username },
        }
      : null;

    const authResponse: Pusher.UserAuthResponse = this.pusher.authenticateUser(
      socketId,
      {
        id: user._id.toString(),
        user_info: UserService.userToUserObject(user),
        watchlist: [],
      },
    );
    return { statusCode: 200, response: authResponse };
  };
}
