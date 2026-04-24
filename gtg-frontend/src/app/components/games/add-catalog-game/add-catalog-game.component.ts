import {Component, inject} from '@angular/core';
import {IGame} from '../../../models/game';
import {GameService} from '../game.service';
import {Location} from '@angular/common';
import {GameFormComponent} from '../game-form/game-form.component';

@Component({
  selector: 'app-add-catalog-game',
  standalone: true,
  imports: [
    GameFormComponent
  ],
  templateUrl: './add-catalog-game.component.html',
  styleUrl: './add-catalog-game.component.scss'
})
export class AddCatalogGameComponent {
  gameService = inject(GameService)
  location = inject(Location)

  async onCreate(newGame: IGame) {
    await this.gameService.addGame(newGame);
    location.back()
  }
}
