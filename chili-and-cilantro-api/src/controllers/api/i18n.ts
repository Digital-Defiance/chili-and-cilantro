import {
  buildNestedI18nForLanguage,
  languageCodeToStringLanguages,
  LanguageCodeValues,
  StringNames,
  translate,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  ApiErrorResponse,
  ApiRequestHandler,
  IApplication,
  IStatusCodeResponse,
  JsonResponse,
  routeConfig,
  TypedHandlers,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Request } from 'express';
import { param } from 'express-validator';
import { BaseController } from '../base';

interface I18nHandlers extends TypedHandlers<JsonResponse | ApiErrorResponse> {
  i18n: ApiRequestHandler<JsonResponse | ApiErrorResponse>;
}

export class I18nController extends BaseController<any, I18nHandlers> {
  constructor(application: IApplication) {
    super(application);
    this.handlers = {
      i18n: this.i18n,
    };
  }
  protected initRouteDefinitions(): void {
    this.routeDefinitions = [
      routeConfig<JsonResponse | ApiErrorResponse, I18nHandlers>(
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

  private i18n: ApiRequestHandler<JsonResponse | ApiErrorResponse> = async (
    req: Request,
  ): Promise<IStatusCodeResponse<JsonResponse | ApiErrorResponse>> => {
    const { languageCode } = req.params;

    const language = languageCodeToStringLanguages(languageCode);
    const i18nTable = buildNestedI18nForLanguage(language);
    return { statusCode: 200, response: i18nTable };
  };
}
