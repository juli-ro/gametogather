import {IUser} from './user';
import {ILookupBase} from './lookupBase';

export interface IGame extends ILookupBase{
  minPlayerNumber: number,
  maxPlayerNumber: number,
  playTime: number,
  userId: string,
  user: IUser | null
}
