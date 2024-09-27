import { IChefDocument, ModelName, ModelNameCollection } from "@chili-and-cilantro/chili-and-cilantro-lib";
import { model } from "mongoose";
import { ChefSchema } from "../schemas/chef";

export const ChefModel = model<IChefDocument>(ModelName.Chef, ChefSchema, ModelNameCollection.Chef);

export default ChefModel;