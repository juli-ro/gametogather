import { Injectable, signal, WritableSignal } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { IGame } from "../../models/game";
import { Router } from "@angular/router";
import { ApiDataService } from "../../shared/api-data.service";
import { FeedbackService } from "../../shared/feedback.service";
import { Location } from "@angular/common";

@Injectable({
	providedIn: "root",
})
export class GameService extends ApiDataService<IGame> {
	protected override signalList = signal<IGame[]>([]);
	protected override signalItem = signal<IGame | null>(null);
	override publicSignalList = this.signalList.asReadonly();
	override publicSignalItem = this.signalItem.asReadonly();

	private signalUserGameList = signal<IGame[]>([]);
	publicUserGameList = this.signalUserGameList.asReadonly();

	//Todo: all sort of methods have to be made because of this extra list (like empty array)
	// see how much of a hassle this is and maybe think of another way
	private signalGroupGameList: WritableSignal<IGame[]> = signal<IGame[]>([]);
	publicSignalGroupGameList = this.signalGroupGameList.asReadonly();

	override getResourceUrl(): string {
		return "game";
	}

	async getUserGamesList(): Promise<void> {
		try {
			const data = await lastValueFrom(this.httpClient.get<IGame[]>(`${this.APIUrl}/UserGames`, await this.getHttpOptions()));
			this.signalUserGameList.set(data);
		} catch (error) {
			await this.handleError(error);
		}
	}

	async getGroupGameList(groupId: string) {
		try {
			const data = await lastValueFrom(this.httpClient.get<IGame[]>(`${this.APIUrl}/GroupGames/${groupId}`, await this.getHttpOptions()));
			this.signalGroupGameList.set(data);
		} catch (error) {
			await this.handleError(error);
		}
	}

	async addGame(gameToAdd: IGame) {
		try {
			const data = await lastValueFrom(this.httpClient.post<IGame>(this.APIUrl, gameToAdd, await this.getHttpOptions()));
			this.signalList.set([...this.signalList(), data]);
		} catch (error) {
			await this.handleError(error);
		}
	}

	async addGameToUser(gameToAdd: IGame) {
		try {
			const data = await lastValueFrom(this.httpClient.post<IGame>(`${this.APIUrl}/AddUserGame`, gameToAdd, await this.getHttpOptions()));
			if (data) {
				this.signalUserGameList.set([...this.signalUserGameList(), data]);
			}
		} catch (error) {
			if (error instanceof HttpErrorResponse) {
				if (error.status == 409) {
					this.feedbackService.openStandardSnackBarTimed("User already added game");
				}
			}
			await this.handleError(error);
		}
	}

	async removeGameFromUser(gameId: string) {
		try {
			const url = `${this.APIUrl}/RemoveUserGame/${gameId}`;
			await lastValueFrom(this.httpClient.delete(url, await this.getHttpOptions()));

			this.signalUserGameList.set(this.signalUserGameList().filter((item) => item.id !== gameId));
		} catch (error) {
			await this.handleError(error);
		}
	}

	emptyGroupGameList() {
		this.signalGroupGameList.set([]);
	}
}
