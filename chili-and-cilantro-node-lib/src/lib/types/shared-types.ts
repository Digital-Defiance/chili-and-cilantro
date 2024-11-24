import {
  ChiliCilantroDocuments,
  ModelName,
} from '@chili-and-cilantro/chili-and-cilantro-lib';
import { ISchemaData } from '../interfaces/schema-data';

/**
 * Schema map interface
 */
export type SchemaMap = Record<ModelName, ISchemaData<ChiliCilantroDocuments>>;
