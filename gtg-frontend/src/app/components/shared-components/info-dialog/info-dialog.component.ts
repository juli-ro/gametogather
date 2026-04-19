import {Component, Inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {DialogData} from '../../../shared/dialogData';

@Component({
  selector: 'app-info-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
  standalone: true,
})
export class InfoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

}
