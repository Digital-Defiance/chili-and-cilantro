import { ITokenUser } from '@chili-and-cilantro/chili-and-cilantro-lib';

export interface ISignedToken {
  token: string;
  tokenUser: ITokenUser;
}
