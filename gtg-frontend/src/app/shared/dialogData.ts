import {ILookupBase} from '../models/lookupBase';

export interface DialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  selectionList?: ILookupBase[]
}
