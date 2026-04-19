import {IMeetUserVote} from './meetUserVote';
import {IModelBase} from './modelBase';

export interface IMeetUser extends IModelBase{
  isHost: Boolean,
  name: string,
  //Todo: Check if unnecessary, VoteService may be the better choice
  meetUserVotes: IMeetUserVote[]
}
