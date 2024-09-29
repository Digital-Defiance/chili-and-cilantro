import {
  ActionType,
  ActionTypeRecordMap,
  IActionDocument,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import mongoose, { Connection, Model, Schema } from 'mongoose';
import { ActionSchemas } from '../action-schema-map';

const BaseActionSchema = new Schema(
  {},
  { discriminatorKey: 'type', timestamps: true },
);
const BaseActionModel = (connection: Connection) =>
  connection.model<IActionDocument>('BaseAction', BaseActionSchema);

function generateDiscriminators<T extends ActionType>(
  connection: Connection,
  actionEnum: Record<string, T>,
  actionSchemas: Record<T, Schema>,
  // actionDocumentTypeMap: ActionDocumentTypes,
): {
  discriminatorRecords: Record<string, mongoose.Model<any>>;
  discriminatorArray: Array<mongoose.Model<any>>;
} {
  const baseModel = BaseActionModel(connection);
  const discriminatorRecords: Record<string, mongoose.Model<any>> = {};
  const discriminatorArray: Array<mongoose.Model<any>> = [];

  Object.keys(actionEnum).forEach((actionKey) => {
    const action = actionEnum[actionKey as keyof typeof actionEnum];
    const schema = actionSchemas[action];
    //const type = actionDocumentTypeMap[action];

    // Ensure the correct type is inferred here
    const discriminator = baseModel.discriminator(action, schema);
    discriminatorRecords[action] = discriminator;
    discriminatorArray.push(discriminator);
  });

  return { discriminatorRecords, discriminatorArray };
}

const ActionDiscriminators = (connection: Connection) =>
  generateDiscriminators(
    connection,
    ActionTypeRecordMap,
    ActionSchemas,
    // ActionDocumentTypesMap,
  );
const ActionDiscriminatorsByActionType = (
  connection: Connection,
): { [key in ActionType]: Model<any> } =>
  ActionDiscriminators(connection).discriminatorRecords as {
    [key in ActionType]: Model<any>;
  };

export {
  ActionDiscriminators,
  ActionDiscriminatorsByActionType,
  BaseActionModel,
};
