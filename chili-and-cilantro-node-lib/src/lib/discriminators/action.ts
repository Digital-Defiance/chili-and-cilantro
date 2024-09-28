import {
  ActionType,
  IActionDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Model, Schema } from 'mongoose';
import { ActionDiscriminatorSchemas } from '../action-discriminator-schemas';
import { IDiscriminatorCollections } from '../interfaces/discriminator-collections';

const loadedDiscriminators: Record<ActionType, Model<any> | undefined> = {
  [ActionType.CREATE_GAME]: undefined,
  [ActionType.END_GAME]: undefined,
  [ActionType.END_ROUND]: undefined,
  [ActionType.EXPIRE_GAME]: undefined,
  [ActionType.FLIP_CARD]: undefined,
  [ActionType.JOIN_GAME]: undefined,
  [ActionType.MAKE_BID]: undefined,
  [ActionType.MESSAGE]: undefined,
  [ActionType.PASS]: undefined,
  [ActionType.PLACE_CARD]: undefined,
  [ActionType.QUIT_GAME]: undefined,
  [ActionType.START_BIDDING]: undefined,
  [ActionType.START_GAME]: undefined,
  [ActionType.START_NEW_ROUND]: undefined,
};

function generateDiscriminators<T extends IActionDocument>(
  baseModel: Model<T>,
  actionDiscriminatorSchemas: Record<ActionType, Schema>,
): IDiscriminatorCollections<T> {
  const discriminatorRecords: Record<string, Model<T>> = {};
  const discriminatorArray: Array<Model<T>> = [];

  Object.values(ActionType).forEach((action: ActionType) => {
    const schema = actionDiscriminatorSchemas[action];

    // Ensure the correct type is inferred here
    if (!loadedDiscriminators[action]) {
      const discriminator = baseModel.discriminator<T>(
        action as string,
        schema,
      );
      if (discriminator) {
        discriminatorRecords[action as string] = discriminator;
        discriminatorArray.push(discriminator);
        loadedDiscriminators[action] = discriminator;
      }
    } else {
      const discriminator = loadedDiscriminators[action];
      if (discriminator) {
        discriminatorRecords[action as string] = discriminator;
        discriminatorArray.push(discriminator);
      }
    }
  });

  return { byType: discriminatorRecords, array: discriminatorArray };
}

export const ActionDiscriminators = <T extends IActionDocument>(
  baseModel: Model<T>,
): IDiscriminatorCollections<T> =>
  generateDiscriminators<T>(baseModel, ActionDiscriminatorSchemas);
