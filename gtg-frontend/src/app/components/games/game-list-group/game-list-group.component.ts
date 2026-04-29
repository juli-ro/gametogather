import { Component, Signal, OnInit, inject } from "@angular/core";
import { GameService } from "../game.service";
import { IGame } from "../../../models/game";

import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect } from "@angular/material/select";
import { IGroup } from "../../../models/group";
import { GroupService } from "../../../shared/group.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { GameOwnersPipe } from "../../../shared/Pipes/game-owners.pipe";

@Component({
	selector: "app-game-list-group",
	imports: [MatLabel, MatFormField, MatSelect, MatOption, ReactiveFormsModule, GameOwnersPipe],
	templateUrl: "./game-list-group.component.html",
	standalone: true,
	styleUrl: "./game-list-group.component.scss",
})
export class GameListGroupComponent implements OnInit {
	private gameService = inject(GameService);
	private groupService = inject(GroupService);

	groupGameList: Signal<IGame[]>;
	selectedGroup: Signal<IGroup | null>;
	groupList: Signal<IGroup[]>;
	groupSelectControl = new FormControl<IGroup | null>(null);

	constructor() {
		this.groupGameList = this.gameService.publicSignalGroupGameList;
		this.selectedGroup = this.groupService.publicSignalItem;
		this.groupList = this.groupService.publicSignalList;
	}

	async ngOnInit(): Promise<void> {
		await this.groupService.getUserGroupList();
		if (this.groupList().length > 0) {
			const firstGroup = this.groupList().at(0);
			if (firstGroup) {
				this.groupService.setSelectedItem(firstGroup);
			}
			if (this.selectedGroup() != null) {
				await this.gameService.getGroupGameList(this.selectedGroup()?.id as string);
				this.groupSelectControl.setValue(this.selectedGroup());
			}
		} else {
			this.gameService.emptyGroupGameList();
		}
	}

	async groupSelected() {
		const selectedItem = this.groupSelectControl.value;
		if (selectedItem != null) {
			this.groupService.setSelectedItem(selectedItem as IGroup);
		}
		if (this.selectedGroup() != null) {
			await this.gameService.getGroupGameList(this.selectedGroup()?.id as string);
		}
	}
}
