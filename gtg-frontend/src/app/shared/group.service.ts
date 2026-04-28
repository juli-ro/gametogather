import { Injectable, signal, WritableSignal } from "@angular/core";
import { ApiDataService } from "./api-data.service";
import { IGroup } from "../models/group";
import { lastValueFrom, Observable } from "rxjs";
import { IGroupSettings } from "../models/groupSettings";
import { IUser } from "../models/user";

@Injectable({
	providedIn: "root",
})
export class GroupService extends ApiDataService<IGroup> {
	protected override signalList: WritableSignal<IGroup[]> = signal<IGroup[]>([]);
	protected override signalItem: WritableSignal<IGroup | null> = signal<IGroup | null>(null);
	override publicSignalList = this.signalList.asReadonly();
	override publicSignalItem = this.signalItem.asReadonly();

	private signalGroupSettings = signal<IGroupSettings | null>(null);
	publicGroupSettings = this.signalGroupSettings.asReadonly();

	override getResourceUrl(): string {
		return "group";
	}

	async getUserGroupList(): Promise<void> {
		try {
			const data = await lastValueFrom(this.httpClient.get<IGroup[]>(`${this.APIUrl}/UserGroup`));
			this.signalList.set(data);
		} catch (error) {
			await this.handleError(error);
		}
	}

	async createNewGroup() {
		try {
			const data = await lastValueFrom(this.httpClient.post<string>(`${this.APIUrl}/UserGroup`, {}));
			if (data) {
				return data;
			} else return "";
		} catch (error) {
			await this.handleError(error);
			//Todo: handle this in handleError?
			this.feedbackService.openStandardSnackBarTimed("Error: Group could not be added");
			return null;
		}
	}

	async getGroupSettings(groupId: string) {
		try {
			const data = await lastValueFrom(
				this.httpClient.get<IGroupSettings>(`${this.APIUrl}/UserGroup/Settings/${groupId}`)
			);
			this.signalGroupSettings.set(data);
		} catch (error) {
			await this.handleError(error);
		}
	}

	async updateGroupSettings(groupSettings: IGroupSettings) {
		try {
			const data = await lastValueFrom(
				this.httpClient.put<IGroupSettings>(`${this.APIUrl}/GroupSettings`, groupSettings)
			);
			if (data) {
				this.signalGroupSettings.set(data);
				this.feedbackService.openStandardSnackBarTimed("Group settings updated");
			}
		} catch (e) {
			await this.handleError(e);
		}
	}
}
