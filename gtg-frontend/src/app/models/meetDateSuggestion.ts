import {IModelBase} from './modelBase';

export interface IMeetDateSuggestion extends IModelBase{
  date: Date,
  isChosenDate: boolean,
  meetId: string,
}
