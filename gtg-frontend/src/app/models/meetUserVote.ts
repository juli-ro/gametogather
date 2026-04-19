import {voteItemTypeEnum} from '../shared/voteItemTypeEnum';
import {IModelBase} from './modelBase';
import {IMeetUser} from './meetUser';

export interface IMeetUserVote extends IModelBase{
  votableItemType: voteItemTypeEnum,
  votableItemId: string,
  rating: number,
  meetUser: IMeetUser
}
