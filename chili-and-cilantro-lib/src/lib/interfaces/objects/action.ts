import { IHasID } from "../has-id";
import { IAction } from "../models/action";

export interface IActionObject extends IAction, IHasID {}