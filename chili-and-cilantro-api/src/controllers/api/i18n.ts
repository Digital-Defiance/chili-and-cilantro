import {
  buildNestedI18nForLanguage,
  languageCodeToStringLanguages,
  LanguageCodeValues,
  StringNames,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ApiRequestHandler,
  handleError,
  IApplication,
  routeConfig,
  sendApiMessageResponse,
  SendFunction,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { NextFunction, Request, Response } from 'express';
import { param } from 'express-validator';
import { BaseController } from '../base';

export class I18nController extends BaseController {
  constructor(application: IApplication) {
    super(application);
    this.handlers = {
      i18n: this.i18n,
    };
  }
  protected initRouteDefinitions(): void {
    this.routeDefinitions = [
      routeConfig<Record<string, any>, true, Array<unknown>>(
        'get',
        '/:languageCode',
        {
          handlerKey: 'i18n',
          useAuthentication: false,
          validation: [
            param('languageCode')
              .custom((value: string) => {
                // value must be one of the valid language codes from LanguageCodes
                return LanguageCodeValues.includes(value);
              })
              .withMessage(translate(StringNames.Error_InvalidLanguageCode)),
          ],
          rawJsonHandler: true,
        },
      ),
    ];
  }

  private i18n: ApiRequestHandler<Record<string, any>> = async (
    req: Request,
    res: Response,
    send: SendFunction<Record<string, any>>,
    next: NextFunction,
  ): Promise<void> => {
    const { languageCode } = req.params;

    try {
      const language = languageCodeToStringLanguages(languageCode);
      const i18nTable = buildNestedI18nForLanguage(language);
      send(200, i18nTable, res);
    } catch (error) {
      handleError(error, res, sendApiMessageResponse, next);
    }
  };
}
