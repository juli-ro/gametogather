import {Component, Signal} from '@angular/core';

import {IGame} from "../../../models/game";
import {GameService} from "../game.service";
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {FeedbackService} from '../../../shared/feedback.service';
import {defaultGuid} from '../../../shared/Util/constants';
import {AddUserGameComponent} from '../add-user-game/add-user-game.component';

@Component({
  selector: 'app-game-list-user',
  imports: [
    MatButton,
    MatIcon,
    MatMiniFabButton,
    AddUserGameComponent
  ],
  templateUrl: './game-list-user.component.html',
  styleUrl: './game-list-user.component.scss',
  standalone: true
})
export class GameListUserComponent {

  gameList: Signal<IGame[]>

  constructor(private gameService: GameService,
              private feedbackService: FeedbackService,
              private router: Router) {
      this.gameList = gameService.publicUserGameList
  }

  async ngOnInit(): Promise<void>{
    await this.gameService.getUserGamesList()
  }

  async addGame(){
    const emptyGame :IGame = {
      id: defaultGuid,
      name: "New Game",
      playTime: 1,
      minPlayerNumber: 1,
      maxPlayerNumber: 1,
      minAge: 1,
      yearPublished: 2020
    };
    await this.gameService.addGame(emptyGame)
  }
  async removeGameFromUser(id: string) {
    const confirmed = await this.feedbackService.openOkCancelDialog("Delete Game?",
      "Are you sure you want to delete the selected Game?",
      "delete");
    if (confirmed) {
      await this.gameService.removeGameFromUser(id);
    }
    else{
      return
    }
  }

  async editGame(gameId: string) {
    await this.router.navigateByUrl(`game-detail/${gameId}`)
  }
}

