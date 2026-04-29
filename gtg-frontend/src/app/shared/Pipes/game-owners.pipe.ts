import { Pipe, PipeTransform } from "@angular/core";
import { IGame } from "../../models/game";
import { IGroupUser } from "../../models/groupUser";

@Pipe({
	name: "gameOwners",
	standalone: true,
})
export class GameOwnersPipe implements PipeTransform {
	transform(game: IGame, groupUsers: IGroupUser[] | undefined) {
		if (!groupUsers || groupUsers.length === 0) return "";

		return groupUsers
			.filter((user) => user.ownedGames.some((ownedGame) => ownedGame.id === game.id))
			.map((user) => user.name)
			.join(", ");
	}
}
