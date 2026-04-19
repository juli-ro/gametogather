import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-hamburger',
  imports: [],
  templateUrl: './hamburger.component.html',
  styleUrl: './hamburger.component.scss',
  standalone: true
})
export class HamburgerComponent {
  @Input() initialState: boolean = false;
  @Input() closed?: Observable<void>;
  @Output() trigger: EventEmitter<void> = new EventEmitter<void>();

  active: boolean = false;

  ngOnInit(): void {
    this.active = this.initialState || false;

    if (this.closed) {
      this.closed.subscribe(() => this.active = false);
    }
  }

  triggered(): void {
    this.active = !this.active;
    this.trigger.emit();
  }

}
