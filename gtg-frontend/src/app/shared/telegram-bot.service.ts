import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class TelegramBotService {
	private httpClient = inject(HttpClient);

	private readonly APIUrl = environment.apiBaseUrl + "Notification";

	sendGroupBroadCast(message: string, groupId: string) {
		return this.httpClient
			.post(this.APIUrl, {
				message: message,
				groupId: groupId,
			})
			.subscribe({
				next: (res) => console.log("Success", res),
				error: (err) => console.error("Error", err),
			});
	}
}
