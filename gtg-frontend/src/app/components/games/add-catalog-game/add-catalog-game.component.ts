import { Component, inject } from "@angular/core";
import { IGame } from "../../../models/game";
import { GameService } from "../game.service";
import { GameFormComponent } from "../game-form/game-form.component";
import { Router } from "@angular/router";

@Component({
	selector: "app-add-catalog-game",
	standalone: true,
	imports: [GameFormComponent],
	templateUrl: "./add-catalog-game.component.html",
	styleUrl: "./add-catalog-game.component.scss",
})
export class AddCatalogGameComponent {
	gameService = inject(GameService);
	router = inject(Router);

	async onCreate(newGame: IGame) {
		await this.gameService.addGame(newGame);
		await this.router.navigateByUrl("/game");
	}
}
