import { IChef } from "../models/chef";
import { IBaseDocument } from "./base";

export interface IChefDocument extends IChef, IBaseDocument<IChef> {};