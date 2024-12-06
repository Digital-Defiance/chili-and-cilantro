import {
  buildNestedI18nForLanguage,
  languageCodeToStringLanguages,
  LanguageCodeValues,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import {
  routeConfig,
  RouteConfig,
} from '@chili-and-cilantro/chili-and-cilantro-node-lib';
import { Request, Response } from 'express';
import { param } from 'express-validator';
import { BaseController } from '../base';

export class I18nController extends BaseController {
  public getRoutes(): RouteConfig<any>[] {
    return [
      routeConfig<any>({
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
      }),
    ];
  }

  private async i18n(req: Request, res: Response): Promise<void> {
    const { languageCode } = req.params;

    const language = languageCodeToStringLanguages(languageCode as string);

    res.status(200).json(buildNestedI18nForLanguage(language));
  }
}
