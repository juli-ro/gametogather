import {Component, Signal} from '@angular/core';
import {IGame} from '../../../models/game';
import {GameService} from '../game.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FeedbackService} from '../../../shared/feedback.service';
import {Location} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-game-detail',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatMiniFabButton
  ],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.scss',
  standalone: true
})
export class GameDetailComponent {

  game: Signal<IGame | null>

  gameForm = new FormGroup({
    name: new FormControl<string>(""),
    minPlayer: new FormControl<number>(0),
    maxPlayer: new FormControl<number>(0),
    playTime: new FormControl<number>(0),
  })

  constructor(private gameService: GameService,
              private route: ActivatedRoute,
              private feedbackService: FeedbackService,
              private location: Location) {
    this.game = this.gameService.publicSignalItem
  }

  async ngOnInit() {
    const id = String(this.route.snapshot.paramMap.get("id"));
    if (id) {
      await this.gameService.getItemById(id)
    }
    const loadedGame = this.game()
    if (loadedGame) {
      this.gameForm.setValue({
        maxPlayer: loadedGame.maxPlayerNumber,
        minPlayer: loadedGame.minPlayerNumber,
        name: loadedGame.name,
        playTime: loadedGame.playTime
      })
    }
  }

  async saveGameEntry() {
    const oldGameEntry = this.game()
    if (oldGameEntry) {

      const gameToUpdate: IGame = {
        id: oldGameEntry.id,
        name: this.gameForm.value.name ?? oldGameEntry.name,
        userId: oldGameEntry.userId,
        playTime: this.gameForm.value.playTime ?? oldGameEntry.playTime,
        minPlayerNumber: this.gameForm.value.minPlayer ?? oldGameEntry.minPlayerNumber,
        maxPlayerNumber: this.gameForm.value.maxPlayer ?? oldGameEntry.maxPlayerNumber,
        user: null
      };
      await this.gameService.updateItemInList(gameToUpdate)
      this.feedbackService.openSnackBarTimed("Game has been updated", "close", 5000)
      this.location.back()
    }
  }

  async deleteGame(){
    try{
      const gameToDelete = this.game()
      if(gameToDelete){
        const confirmed = await this.feedbackService.openOkCancelDialog("Delete Game?",
          "Are you sure you want to delete the selected Game?",
          "delete");
        if (confirmed) {
          await this.gameService.deleteItem(gameToDelete.id);
        }
        else{
          return
        }
        this.location.back()
      }
    }catch (e) {
      this.feedbackService.openSnackBarTimed("Something went wrong when deleting item", "close", 5000)
      this.location.back()
    }

  }


  navigateBack(){
    this.location.back()
  }
}
