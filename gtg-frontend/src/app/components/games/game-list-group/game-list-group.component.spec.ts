import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListGroupComponent } from './game-list-group.component';

describe('GameListGroupComponent', () => {
  let component: GameListGroupComponent;
  let fixture: ComponentFixture<GameListGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameListGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameListGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
