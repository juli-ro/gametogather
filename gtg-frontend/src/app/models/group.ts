import { ILookupBase } from "./lookupBase";
import { IGroupUser } from "./groupUser";

export interface IGroup extends ILookupBase {
	groupUsers: IGroupUser[];
}
