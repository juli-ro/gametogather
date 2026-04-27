import { Component, Signal, OnInit, inject } from "@angular/core";
import { IGroup } from "../../models/group";
import { GroupService } from "../../shared/group.service";
import { GameService } from "../games/game.service";
import { IGame } from "../../models/game";
import { LookupTableComponent } from "../shared-components/lookup-table/lookup-table.component";
import { ILookupBase } from "../../models/lookupBase";
import { MeetService } from "../../shared/meet.service";
import { IMeet } from "../../models/meet";
import { Router } from "@angular/router";
import { MatMiniFabButton } from "@angular/material/button";
import { FeedbackService } from "../../shared/feedback.service";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect } from "@angular/material/select";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

@Component({
	selector: "app-user-dashboard",
	imports: [LookupTableComponent, MatIcon, MatMiniFabButton, MatFormField, MatLabel, MatOption, MatSelect, ReactiveFormsModule],
	templateUrl: "./user-dashboard.component.html",
	styleUrl: "./user-dashboard.component.scss",
	standalone: true,
})
export class UserDashboardComponent implements OnInit {
	private groupService = inject(GroupService);
	private gameService = inject(GameService);
	private meetService = inject(MeetService);
	private feedbackService = inject(FeedbackService);
	private router = inject(Router);

	groupList: Signal<IGroup[]>;
	selectedGroup: Signal<IGroup | null>;
	gameList: Signal<IGame[]>;
	groupGameList: Signal<IGame[]>;
	meetList: Signal<IMeet[]>;
	pastMeetList: Signal<IMeet[]>;
	futureMeetList: Signal<IMeet[]>;
	groupSelectControl = new FormControl<IGroup | null>(null);

	constructor() {
		this.groupList = this.groupService.publicSignalList;
		this.selectedGroup = this.groupService.publicSignalItem;
		this.gameList = this.gameService.publicUserGameList;
		this.groupGameList = this.gameService.publicSignalGroupGameList;
		this.meetList = this.meetService.publicSignalList;
		this.pastMeetList = this.meetService.pastMeetings;
		this.futureMeetList = this.meetService.futureMeetings;
	}

	async ngOnInit(): Promise<void> {
		await this.meetService.getUserMeetsList();
		await this.groupService.getUserGroupList();
		await this.gameService.getUserGamesList();

		if (this.groupList().length > 0) {
			const firstGroup = this.groupList().at(0);
			if (firstGroup) {
				this.groupService.setSelectedItem(firstGroup);
				this.groupSelectControl.setValue(firstGroup);
			}
			if (this.selectedGroup() != null) {
				await this.gameService.getGroupGameList(this.selectedGroup()?.id as string);
			}
		} else {
			this.gameService.emptyGroupGameList();
			this.meetService.emptyList();
		}
	}

	// groupChanged(chosenGroup: ILookupBase) {
	//
	// }
	async groupChanged(group: ILookupBase) {
		this.groupService.setSelectedItem(group);
		await this.gameService.getGroupGameList(group.id);
		await this.meetService.getGroupMeetsList(group.id);
	}

	async groupSelected() {
		const selectedItem = this.groupSelectControl.value;
		if (selectedItem != null) {
			this.groupService.setSelectedItem(selectedItem);
			await this.gameService.getGroupGameList(selectedItem.id);
			// await this.meetService.getGroupMeetsList(selectedItem.id)
		}
	}

	async meetingDetailPress(meetingId: string) {
		await this.router.navigateByUrl(`/meet-detail/${meetingId}`);
	}

	async createNewGroupMeeting() {
		if (this.groupList().length < 1) {
			await this.feedbackService.openInfoDialog("No Group Selected", "There are no groups or none have been selected");
			return;
		}

		const resultGroup: ILookupBase = await this.feedbackService.openSelectionDialog(
			"Create Group Meeting",
			"Choose Group you want to create a meeting for",
			this.groupList()
		);

		//Todo: Future - Check to see if there is a more elegant solution
		if (resultGroup) {
			const chosenGroup = this.groupList().find((group) => group.id == resultGroup.id);
			if (chosenGroup) {
				if (chosenGroup) {
					const newMeetingId = await this.meetService.createNewGroupMeeting(chosenGroup);
					if (newMeetingId) {
						await this.router.navigateByUrl(`/meet-detail/${newMeetingId}`);
					}
				} else {
					await this.feedbackService.openInfoDialog("No Group Selected", "There are no groups or none have been selected");
				}
			}
		} else {
			this.feedbackService.openStandardSnackBar("No group was chosen");
		}
	}
}
