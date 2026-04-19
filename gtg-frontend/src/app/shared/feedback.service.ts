import {inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {GeneralDialogComponent} from '../components/shared-components/general-dialog/general-dialog.component';
import {firstValueFrom} from 'rxjs';
import {InfoDialogComponent} from '../components/shared-components/info-dialog/info-dialog.component';
import {ILookupBase} from '../models/lookupBase';
import {SelectionDialogComponent} from '../components/shared-components/selection-dialog/selection-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private _dialog: MatDialog = inject(MatDialog)

  constructor() {
  }

  async openOkCancelDialog(title: string,
                           message: string,
                           confirmText: string = "ok",
                           cancelText: string = "cancel"): Promise<boolean> {
      const dialogRef = this._dialog.open(GeneralDialogComponent, {
        data: {
          title: title,
          message: message,
          confirmText: confirmText,
          cancelText: cancelText
        }
      });
    const result = await firstValueFrom(dialogRef.afterClosed())
    return result === true
  }

  async openInfoDialog(title: string,
                           message: string,
                           confirmText: string = "ok"): Promise<boolean> {
    const dialogRef = this._dialog.open(InfoDialogComponent, {
      data: {
        title: title,
        message: message,
        confirmText: confirmText,
      }
    });
    const result = await firstValueFrom(dialogRef.afterClosed())
    return result === true
  }

  async openSelectionDialog(title: string,
                           message: string,
                           selectionList: ILookupBase[],
                           confirmText: string = "ok",
                           cancelText: string = "cancel"): Promise<ILookupBase> {
    const dialogRef = this._dialog.open(SelectionDialogComponent, {
      data: {
        title: title,
        message: message,
        selectionList: selectionList,
        confirmText: confirmText,
        cancelText: cancelText
      }
    });
    return await firstValueFrom(dialogRef.afterClosed())
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  openStandardSnackBar(message: string) {
    this._snackBar.open(message, "Close");
  }

  openSnackBarTimed(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration});
  }

  openStandardSnackBarTimed(message: string) {
    this._snackBar.open(message, "Close", {duration: 5000});
  }


}
