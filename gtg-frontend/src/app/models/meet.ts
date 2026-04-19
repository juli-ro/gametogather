import {ILookupBase} from './lookupBase';
import {IMeetDateSuggestion} from './meetDateSuggestion';
import {IMeetUser} from './meetUser';

export interface IMeet extends ILookupBase{
  meetType: string;
  hasMovies: boolean;
  hasGames: boolean;
  groupId: string;
  meetActivities: []
  meetDateSuggestions: IMeetDateSuggestion[];
  meetUsers: IMeetUser[]
}
