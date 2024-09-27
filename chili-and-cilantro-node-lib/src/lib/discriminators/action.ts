import mongoose, { Model, Schema } from 'mongoose';
import { ActionDocumentTypesMap, ActionDocumentTypes, IActionDocument, ActionType, ActionTypeRecordMap } from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ActionSchemas } from '../action-schema-map';

const BaseSchema = new Schema({}, { discriminatorKey: 'kind', timestamps: true });
const BaseModel = mongoose.model<IActionDocument>('Base', BaseSchema);

function generateDiscriminators<T extends ActionType>(
    baseModel: mongoose.Model<any>, 
    actionEnum: Record<string, T>, 
    actionSchemas: Record<T, Schema>, 
    actionDocumentTypeMap: ActionDocumentTypes
): { discriminatorRecords: Record<string, mongoose.Model<any>>, discriminatorArray: Array<mongoose.Model<any>> } {
    const discriminatorRecords: Record<string, mongoose.Model<any>> = {};
    const discriminatorArray: Array<mongoose.Model<any>> = [];

    Object.keys(actionEnum).forEach(actionKey => {
        const action = actionEnum[actionKey as keyof typeof actionEnum];
        const schema = actionSchemas[action];
        const type = actionDocumentTypeMap[action];

        // Ensure the correct type is inferred here
        const discriminator = baseModel.discriminator(action, schema);
        discriminatorRecords[action] = discriminator;
        discriminatorArray.push(discriminator);
    });

    return {discriminatorRecords, discriminatorArray};
}

const ActionDiscriminators = generateDiscriminators(BaseModel, ActionTypeRecordMap, ActionSchemas, ActionDocumentTypesMap);
const ActionDiscriminatorsByActionType: { [key in ActionType]: Model<any>} = ActionDiscriminators.discriminatorRecords as { [key in ActionType]: Model<any>};

export { BaseModel, ActionDiscriminators, ActionDiscriminatorsByActionType };