import { MatButton } from "@angular/material/button";
import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { DialogData } from "../../../shared/dialogData";

@Component({
	selector: "app-general-dialog",
	imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButton, MatDialogTitle],
	templateUrl: "./general-dialog.component.html",
	styleUrl: "./general-dialog.component.scss",
	standalone: true,
})
export class GeneralDialogComponent {
	public data: DialogData = inject(MAT_DIALOG_DATA);
}
