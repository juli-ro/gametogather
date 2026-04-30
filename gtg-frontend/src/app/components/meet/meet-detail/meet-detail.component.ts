import { Component, computed, signal, Signal, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MeetService } from "../../../shared/meet.service";
import { IMeet } from "../../../models/meet";
import { DatePipe, Location } from "@angular/common";
import {
	MatDatepickerToggle,
	MatDateRangeInput,
	MatDateRangePicker,
	MatEndDate,
	MatStartDate,
} from "@angular/material/datepicker";
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { IMeetDateSuggestion } from "../../../models/meetDateSuggestion";
import { FeedbackService } from "../../../shared/feedback.service";
import { getDateRange, toFullUtCDate } from "../../../shared/Util/date-utils";
import { MatButton, MatIconButton } from "@angular/material/button";
import { GameService } from "../../games/game.service";
import { IGame } from "../../../models/game";
import { VoteService } from "../../../shared/vote.service";
import { IMeetUserVote } from "../../../models/meetUserVote";
import { voteItemTypeEnum } from "../../../shared/voteItemTypeEnum";
import { IMeetUser } from "../../../models/meetUser";
import { BreakpointObserver } from "@angular/cdk/layout";
import { bPoint768px, defaultGuid } from "../../../shared/Util/constants";
import {
	MatExpansionPanel,
	MatExpansionPanelHeader,
	MatExpansionPanelTitle,
} from "@angular/material/expansion";
import { MatIcon } from "@angular/material/icon";
import { GroupService } from "../../../shared/group.service";
import { IGroup } from "../../../models/group";
import { TelegramBotService } from "../../../shared/telegram-bot.service";
import { ParticipantOverviewComponent } from "../participant-overview/participant-overview.component";

@Component({
	selector: "app-meet-detail",
	imports: [
		DatePipe,
		MatFormField,
		MatFormFieldModule,
		MatLabel,
		MatHint,
		MatDatepickerToggle,
		MatInput,
		ReactiveFormsModule,
		MatButton,
		MatDateRangeInput,
		MatDateRangePicker,
		MatStartDate,
		MatEndDate,
		MatExpansionPanel,
		MatExpansionPanelHeader,
		MatExpansionPanelTitle,
		MatIconButton,
		MatIcon,
		ParticipantOverviewComponent,
	],
	providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: "de-DE" }],
	templateUrl: "./meet-detail.component.html",
	styleUrl: "./meet-detail.component.scss",
	standalone: true,
})
export class MeetDetailComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private meetService = inject(MeetService);
	private voteService = inject(VoteService);
	private gameService = inject(GameService);
	private feedbackService = inject(FeedbackService);
	private groupService = inject(GroupService);
	private location = inject(Location);
	private telegramService = inject(TelegramBotService);
	private breakpointObserver = inject(BreakpointObserver);

	meeting: Signal<IMeet | null>;
	groupGameList: Signal<IGame[]>;
	meetVotes: Signal<IMeetUserVote[]>;
	currentMeetUser: Signal<IMeetUser | null>;
	meetingGroup: Signal<IGroup | null>;
	isUpdatingParticipant = signal(false);
	protected readonly voteItemTypeEnum = voteItemTypeEnum;
	screenSizeS = false;
	readonly dateSuggestionPanelOpenState = signal(false);

	// chosenDate = new FormControl(new Date(new Date().setHours(0, 0, 0, 0)))

	meetingName = new FormControl<string | null>("");

	readonly range = new FormGroup({
		start: new FormControl<Date | null>(null),
		end: new FormControl<Date | null>(null),
	});

	viewGameVotes = computed(() => {
		return this.groupGameList().map((game) => ({
			game,
			votes: this.meetVotes().filter(
				(v) => v.votableItemType === voteItemTypeEnum.Game && v.votableItemId === game.id
			),
		}));
	});

	viewDateVotes: Signal<{ date: IMeetDateSuggestion; votes: IMeetUserVote[] }[]> = computed(() => {
		const currentMeeting = this.meeting();
		return (
			currentMeeting?.meetDateSuggestions
				.map((date) => ({
					date,
					votes: this.meetVotes().filter(
						(v) => v.votableItemType === voteItemTypeEnum.Date && v.votableItemId === date.id
					),
				}))
				.sort((a, b) => {
					return (b.date.isChosenDate ? 1 : 0) - (a.date.isChosenDate ? 1 : 0);
				}) ?? []
		);
	});

	// hasSelectedDate: Signal<boolean> = computed(() => {
	//     const currentMeeting = this.meeting();
	//     return currentMeeting?.meetDateSuggestions.some(x => x.isChosenDate) ?? false
	//   }
	// )

	selectedDate: Signal<IMeetDateSuggestion | null> = computed(() => {
		const currentMeeting = this.meeting();
		const suggestionList = currentMeeting?.meetDateSuggestions;
		if (suggestionList) {
			const selected = suggestionList.find((x) => x.isChosenDate);
			if (selected) {
				return selected;
			}
		}
		return null;
	});

	constructor() {
		this.meeting = this.meetService.publicSignalItem;
		this.groupGameList = this.gameService.publicSignalGroupGameList;
		this.meetVotes = this.voteService.publicSignalList;
		this.currentMeetUser = this.meetService.publicCurrentMeetUser;
		this.meetingGroup = this.groupService.publicSignalItem;
	}

	async ngOnInit() {
		try {
			const id = String(this.route.snapshot.paramMap.get("id"));
			if (id) {
				await this.meetService.getItemById(id);
				const meet = this.meeting();
				//Todo: Future - check if this userId check is needed. Maybe that is a responsibility for the service
				if (meet) {
					this.meetingName.setValue(meet.name);
					await this.meetService.setCurrentMeetUser(meet);
					//Todo: only show games of users taking part in meet (either mark all as attending and remove games later,
					// or only show games after user "accepted" taking part in meet)
					await this.gameService.getGroupGameList(meet.groupId);
					await this.voteService.getMeetingVotes(meet.id);
					await this.groupService.getItemById(meet.groupId);
					if (!this.selectedDate() && meet.meetDateSuggestions.length > 0) {
						this.dateSuggestionPanelOpenState.set(true);
					}
				}
			}
		} catch {
			this.feedbackService.openSnackBarTimed("meeting could not be found", "Close", 4000);
			this.location.back();
		}
		this.breakpointObserver
			// pass values from constants.ts
			.observe([bPoint768px])
			.subscribe((x) => {
				// check if defined breakpoints match the screen size
				this.screenSizeS = x.breakpoints[bPoint768px];
			});
	}

	async setDateRange() {
		const startRange = this.range.value.start;
		const endRange = this.range.value.end;
		if (startRange && endRange) {
			const dateArray = getDateRange(startRange, endRange);
			dateArray.forEach((x) => this.setSingleDate(x));
		}
	}

	// async setDate() {
	//   const date = this.chosenDate.value
	//   if (date == null) {
	//     return
	//   }
	//   await this.setSingleDate(date)
	// }

	async setSingleDate(date: Date) {
		const meeting = this.meeting();
		const utCDate = toFullUtCDate(date);

		if (
			meeting?.meetDateSuggestions.some(
				(x) => toFullUtCDate(new Date(x.date)).getTime() === utCDate.getTime()
			)
		) {
			const errorMessage = `date ${toFullUtCDate(new Date(date))} already exists internal`;
			this.feedbackService.openSnackBarTimed(errorMessage, "X", 3000);
			return;
		}

		const meetId = meeting?.id;
		if (meetId) {
			const suggestion: IMeetDateSuggestion = {
				id: defaultGuid,
				date: utCDate,
				meetId: meetId,
				isChosenDate: false,
			};

			await this.meetService.addDateSuggestion(suggestion);
		}
	}

	async selectDate(date: IMeetDateSuggestion) {
		if (this.meeting()?.meetDateSuggestions.some((x) => x.isChosenDate) && !date.isChosenDate) {
			this.feedbackService.openStandardSnackBarTimed("Date has already been selected");
			return;
		}
		await this.meetService.selectDateSuggestion(date);

		if (!date.isChosenDate) {
			this.dateSuggestionPanelOpenState.set(false);
		}
	}

	setVoteEnum(type: voteItemTypeEnum): voteItemTypeEnum {
		return type;
	}

	//Todo: maybe put a lot of functionality in service
	async AddVoteForUser(type: voteItemTypeEnum, itemId: string) {
		const currentMeetUser = this.currentMeetUser();
		if (currentMeetUser) {
			if (this.checkIfVoteExists(currentMeetUser, itemId)) {
				const voteToRemove = this.meetVotes().find(
					(vote) => vote.votableItemId == itemId && vote.meetUser.id == currentMeetUser.id
				);
				// this.feedbackService.openStandardSnackBarTimed("You've already cast a vote for this item")

				if (voteToRemove) {
					await this.voteService.deleteItem(voteToRemove.id);
					this.feedbackService.openStandardSnackBarTimed("vote removed");
				}

				return;
			}

			const vote: IMeetUserVote = {
				id: defaultGuid,
				votableItemType: type,
				votableItemId: itemId,
				rating: 0,
				meetUser: currentMeetUser,
			};
			await this.voteService.addItem(vote);
		}
	}

	private checkIfVoteExists(currentUser: IMeetUser, itemId: string): boolean {
		return this.meetVotes().some(
			(x) => x.meetUser.id === currentUser.id && x.votableItemId === itemId
		);
	}

	async updateMeetingName() {
		const meet = this.meeting();
		const newMeetingName = this.meetingName.value;
		if (meet && newMeetingName) {
			meet.name = newMeetingName;
			await this.meetService.updateMeeting(meet);
			const groupId = meet.groupId;
			if (groupId) {
				this.telegramService.sendGroupBroadCast(
					`Name has been changed to ${newMeetingName}`,
					groupId
				);
			}
		}
	}

	navigateBack() {
		this.location.back();
	}

	protected onParticipationChanged(event: { meetUserId: string; isParticipating: boolean }) {
		this.isUpdatingParticipant.set(true);

		this.meetService.updateParticipant(event.meetUserId, event.isParticipating);

		this.isUpdatingParticipant.set(false);
	}
}
