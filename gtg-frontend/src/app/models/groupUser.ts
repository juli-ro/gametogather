import { ILookupBase } from "./lookupBase";

export interface IGroupUser extends ILookupBase {
	isGroupAdmin: boolean;
	ownedGames: ILookupBase[];
}
