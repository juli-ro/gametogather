import {Component, Signal} from '@angular/core';

import {IGame} from "../../../models/game";
import {GameService} from "../game.service";
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';
import {FeedbackService} from '../../../shared/feedback.service';
import {defaultGuid} from '../../../shared/Util/constants';

@Component({
  selector: 'app-game-list-user',
  imports: [
    MatButton,
    MatIcon,
    MatMiniFabButton
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
      this.gameList = gameService.publicSignalList
  }

  async ngOnInit(): Promise<void>{
    await this.gameService.getUserGamesList()
  }

  async addGame(){
    const emptyGame :IGame = {
      id: defaultGuid,
      name: "New Game",
      userId: defaultGuid,
      playTime: 1,
      minPlayerNumber: 1,
      maxPlayerNumber: 1,
      user: null
    };
    await this.gameService.addGame(emptyGame)
  }
  async deleteGame(id: string) {
    const confirmed = await this.feedbackService.openOkCancelDialog("Delete Game?",
      "Are you sure you want to delete the selected Game?",
      "delete");
    if (confirmed) {
      await this.gameService.deleteItem(id);
    }
    else{
      return
    }
  }

  async editGame(gameId: string) {
    await this.router.navigateByUrl(`game-detail/${gameId}`)
  }
}

