import { IMeetUserVote } from "./meetUserVote";
import { IModelBase } from "./modelBase";

export interface IMeetUser extends IModelBase {
	isHost: boolean;
	name: string;
	//Todo: Check if unnecessary, VoteService may be the better choice
	meetUserVotes: IMeetUserVote[];
}
