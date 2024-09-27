import { IGameDocument, ModelName, ModelNameCollection } from "@chili-and-cilantro/chili-and-cilantro-lib";
import { model } from "mongoose";
import { GameSchema } from "../schemas/game";

export const GameModel = model<IGameDocument>(ModelName.Game, GameSchema, ModelNameCollection.Game);

export default GameModel;