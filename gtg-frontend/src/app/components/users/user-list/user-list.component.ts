import { Component, Signal, OnInit, inject } from "@angular/core";
import { IFullUser } from "../../../models/fullUser";
import { Router } from "@angular/router";
import { UserService } from "../../../shared/user.service";
import { MatButton, MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { defaultGuid } from "../../../shared/Util/constants";

@Component({
	selector: "app-user-list",
	imports: [MatIcon, MatMiniFabButton, MatButton],
	templateUrl: "./user-list.component.html",
	styleUrl: "./user-list.component.scss",
	standalone: true,
})
export class UserListComponent implements OnInit {
	private userService = inject(UserService);
	private router = inject(Router);

	fullUserList: Signal<IFullUser[]>;

	constructor() {
		this.fullUserList = this.userService.publicSignalList;
	}

	async ngOnInit(): Promise<void> {
		await this.userService.getAllAdminUsers();
	}

	async editUser(userId: string) {
		await this.router.navigateByUrl(`user-detail/${userId}`);
	}

	async addUser() {
		const userToAdd: IFullUser = {
			id: defaultGuid,
			name: "newUserName",
			email: "new Email",
			roleName: "",
		};
		await this.userService.createFullUser(userToAdd);
	}
}
