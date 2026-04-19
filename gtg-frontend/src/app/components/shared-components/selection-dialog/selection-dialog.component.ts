import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {DialogData} from '../../../shared/dialogData';
import {MatButton} from '@angular/material/button';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ILookupBase} from '../../../models/lookupBase';

@Component({
  selector: 'app-selection-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule
  ],
  templateUrl: './selection-dialog.component.html',
  styleUrl: './selection-dialog.component.scss',
  standalone: true
})
export class SelectionDialogComponent {

  groupSelectControl = new FormControl<ILookupBase | null>(null)
  selectedItem: ILookupBase | null


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    if(data.selectionList){
      this.groupSelectControl.setValue(data.selectionList[0])
    }
    this.selectedItem = null;
  }
}
