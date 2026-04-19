import {IGame} from './game';
import {ILookupBase} from './lookupBase';

export interface IUser extends ILookupBase{
  roleName: string,
  games: IGame[]
}
