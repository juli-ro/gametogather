import { Component, input, output } from "@angular/core";
import { IMeetUser } from "../../../models/meetUser";
import { MatCheckbox } from "@angular/material/checkbox";

@Component({
	selector: "app-participant-overview",
	standalone: true,
	imports: [MatCheckbox],
	templateUrl: "./participant-overview.component.html",
	styleUrl: "./participant-overview.component.scss",
})
export class ParticipantOverviewComponent {
	meetUsers = input<IMeetUser[]>();
	currentUser = input<IMeetUser>();

	isUpdating = input<boolean>();
	participationChange = output<{ meetUserId: string; isParticipating: boolean }>();

	toggleParticipation(event: MouseEvent, meetUser: IMeetUser) {
		event.preventDefault();
		if (this.isUpdating()) return;

		const intendedState = !meetUser.isParticipating;
		this.participationChange.emit({
			meetUserId: meetUser.id,
			isParticipating: intendedState,
		});
	}
}
