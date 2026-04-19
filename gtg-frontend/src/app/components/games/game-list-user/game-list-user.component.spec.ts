import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListUserComponent } from './game-list-user.component';

describe('GameListUserComponent', () => {
  let component: GameListUserComponent;
  let fixture: ComponentFixture<GameListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameListUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
