import {Component, effect, inject, input, output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {IGame} from '../../../models/game';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField
  ],
  templateUrl: './game-form.component.html',
  styleUrl: './game-form.component.scss',
})
export class GameFormComponent {
  private fb = inject(NonNullableFormBuilder)

  initialData = input<Partial<IGame>>();
  submitText = input<string>('Save Game')

  save = output<IGame>()

  gameForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    minPlayerNumber: [0, [Validators.required, Validators.min(1)]],
    maxPlayerNumber: [0, [Validators.required, Validators.min(1)]],
    playTime: [0, [Validators.required, Validators.min(1)]],
    minAge: [0, [Validators.required, Validators.min(0)]],
    yearPublished: [0, Validators.required],
  })

  constructor() {
    effect(() => {
      const data = this.initialData();
      if (data) {
        this.gameForm.patchValue(data);
      }
    });
  }

  submit() {
    if (this.gameForm.valid) {
      this.save.emit(this.gameForm.getRawValue() as IGame);
    }
  }
}
