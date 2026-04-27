import {Component, inject, Signal} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {debounceTime, distinctUntilChanged, map, Observable, startWith} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GameService} from '../game.service';
import {IGame} from '../../../models/game';
import {MatFabButton} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-user-game',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatFabButton,
  ],
  templateUrl: './add-user-game.component.html',
  styleUrl: './add-user-game.component.scss',
  standalone: true
})
export class AddUserGameComponent {
  gameService: GameService = inject(GameService)
  router: Router = inject(Router)

  gameSearchControl = new FormControl<string | IGame | null>(null)
  filteredOptions: Observable<IGame[]>
  options: Signal<IGame[]> = this.gameService.publicSignalList
  selectedItem: IGame | null = null

  constructor() {
    this.filteredOptions = this.gameSearchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {

        const name = typeof value === 'string' ? value : value?.name;
        return name && name.length >= 1 ? this.filter(name) : [];
      })
    )
  }

  async ngOnInit() {
    await this.gameService.getList()
  }

  private filter(value: string): IGame[] {
    const filterValue = value.toLowerCase();
    return this.options().filter(option => option.name.toLowerCase().includes(filterValue))
      .slice(0, 50);
  }

  displayFn(game: IGame): string {
    return game && game.name ? game.name : '';
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedItem = event.option.value;
  }

  onInputChange() {
    const value = this.gameSearchControl.value;

    if (typeof value === 'string' && (!this.selectedItem || value !== this.selectedItem.name)) {
      this.selectedItem = null;
    }
  }

  protected async addGameToUser(){
    if(this.selectedItem){
      await this.gameService.addGameToUser(this.selectedItem)
    }
  }

  protected async addGameToCatalog(){
    await this.router.navigateByUrl("/add-catalog-game")
  }
}
