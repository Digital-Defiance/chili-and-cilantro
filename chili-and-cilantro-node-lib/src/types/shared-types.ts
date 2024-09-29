import {
  ActionDocumentTypes,
  ActionType,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { Schema } from 'mongoose';
import { ISchemaModelData } from '../lib/interfaces/schema-model-data';

/**
 * Schema map interface
 */
export type SchemaMap = {
  [key in ModelName]: ISchemaModelData<any>;
};

export type ActionSchemaMapType = {
  [K in ActionType]: Schema<ActionDocumentTypes[K]>;
};
