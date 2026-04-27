import {Component, inject, OnInit} from '@angular/core';
import {GameFormComponent} from '../game-form/game-form.component';
import {IGame} from '../../../models/game';
import {GameService} from '../game.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-edit-catalog-game',
  standalone: true,
  imports: [
    GameFormComponent
  ],
  templateUrl: './edit-catalog-game.component.html',
  styleUrl: './edit-catalog-game.component.scss',
})
export class EditCatalogGameComponent implements OnInit {

  gameService = inject(GameService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  gameToEdit = this.gameService.publicSignalItem

  async ngOnInit() {
    await this.gameService.getItemById(this.route.snapshot.params['id'])
  }

  async onUpdate(updatedGame: IGame) {
    updatedGame.id = this.route.snapshot.params['id']
    await this.gameService.updateItemInList(updatedGame);
    await this.router.navigateByUrl('/game');
  }
}
