import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Login } from "../../models/login";
import { jwtEnum } from "../../shared/jwtEnum";
import { lastValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";
import { isNullOrWhitespace } from "../../shared/Util/string-utils";

interface ISessionResult {
	token: string;
}

@Injectable({
	providedIn: "root",
})
export class AuthService {
	private httpClient = inject(HttpClient);

	private readonly APIUrl: string = environment.apiBaseUrl + "Login";

	private isAdminSignal: WritableSignal<boolean> = signal<boolean>(false);
	private isAuthenticatedSignal: WritableSignal<boolean> = signal<boolean>(false);

	readonly isAdmin = this.isAdminSignal.asReadonly();
	readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();

	async login(loginData: Login) {
		this.isAdminSignal.set(false);
		this.isAuthenticatedSignal.set(false);
		const result = await lastValueFrom(this.httpClient.post<ISessionResult>(this.APIUrl, loginData));
		if (result) {
			await this.setSession(result);
		}
		//Todo: handleError
	}

	getHasIdToke() {
		const token: string | null = localStorage.getItem("id_token");
		if (token) {
			return true;
		}
		this.unsetSession();
		return false;
	}

	checkIfAdmin(): boolean {
		const token = localStorage.getItem("id_token");

		if (!token) {
			return false;
		}

		return this.getValueFromToken(token, jwtEnum.role) == "admin";
	}

	// getToken(): string{
	//   const token: string | null = localStorage.getItem("id_token");
	//   if(token == null){
	//     this.unsetSession()
	//     return "";
	//   }
	//   return token;
	// }

	unsetSession() {
		this.isAdminSignal.set(false);
		this.isAuthenticatedSignal.set(false);
		//Todo: clean break for now. Research other methods like a cleanup on logout
		window.location.href = "/login";
	}

	//Todo: probably obsolete
	// getUserIdFromToken(): string{
	//   return this.getValueFromToken(this.getToken(), jwtEnum.user_id)
	// }

	getValueFromToken(token: string, key: string): string {
		if (isNullOrWhitespace(token)) {
			return "";
		}
		const decodedToken = this.decodeToken(token);
		return JSON.parse(decodedToken)[key];
	}

	private decodeToken(token: string): string {
		return atob(token.split(".")[1]);
	}

	async setSession(sessionResult: ISessionResult) {
		this.isAuthenticatedSignal.set(true);
		await localStorage.setItem(jwtEnum.id_token, sessionResult.token);
		if (this.getValueFromToken(sessionResult.token, jwtEnum.role) == "admin") {
			this.isAdminSignal.set(true);
		}
	}

	async logout() {
		localStorage.removeItem(jwtEnum.id_token);
		this.unsetSession();
	}
}
