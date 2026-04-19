import {ILookupBase} from './lookupBase';


export interface IFullUser extends ILookupBase{
  email: string,
  roleName: string,
}
