import {
  buildNestedI18nForLanguage,
  languageCodeToStringLanguages,
  LanguageCodeValues,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  handleError,
  routeConfig,
  RouteConfig,
  sendApiMessageResponse,
  SendFunction,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { NextFunction, Request, Response } from 'express';
import { param } from 'express-validator';
import { BaseController } from '../base';

export class I18nController extends BaseController {
  public getRoutes(): RouteConfig<Record<string, any>, true, Array<unknown>>[] {
    return [
      routeConfig<Record<string, any>, true, Array<unknown>>({
        method: 'get',
        path: '/:languageCode',
        handler: this.i18n,
        useAuthentication: false,
        validation: [
          param('languageCode')
            .custom((value: string) => {
              // value must be one of the valid language codes from LanguageCodes
              return LanguageCodeValues.includes(value);
            })
            .withMessage('Invalid language code'),
        ],
        rawJsonHandler: true,
      }),
    ];
  }

  private async i18n(
    req: Request,
    res: Response,
    send: SendFunction<Record<string, any>>,
    next: NextFunction,
  ): Promise<void> {
    const { languageCode } = req.params;

    try {
      const language = languageCodeToStringLanguages(languageCode);
      const i18nTable = buildNestedI18nForLanguage(language);
      send(200, i18nTable, res);
    } catch (error) {
      handleError(error, res, sendApiMessageResponse, next);
    }
  }
}
