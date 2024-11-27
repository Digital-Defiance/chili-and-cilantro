import {
  ActionType,
  ActionTypeRecordMap,
  IActionDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Model, Schema } from 'mongoose';
import { ActionSchemas } from '../action-schema-map';
import { IDiscriminatorCollections } from '../interfaces/discriminator-collections';

function generateDiscriminators<T extends IActionDocument>(
  baseModel: Model<T>,
  actionEnum: Record<string, ActionType>,
  actionSchemas: Record<ActionType, Schema>,
): IDiscriminatorCollections<T> {
  const discriminatorRecords: Record<string, Model<T>> = {};
  const discriminatorArray: Array<Model<T>> = [];

  Object.keys(actionEnum).forEach((actionKey) => {
    const action = actionEnum[actionKey as keyof typeof actionEnum];
    const schema = actionSchemas[action];
    //const type = actionDocumentTypeMap[action];

    // Ensure the correct type is inferred here
    const discriminator = baseModel.discriminator<T>(action, schema);
    discriminatorRecords[action] = discriminator;
    discriminatorArray.push(discriminator);
  });

  return { byType: discriminatorRecords, array: discriminatorArray };
}

export const ActionDiscriminators = <T extends IActionDocument>(
  baseModel: Model<T>,
): IDiscriminatorCollections<T> =>
  generateDiscriminators<T>(baseModel, ActionTypeRecordMap, ActionSchemas);
