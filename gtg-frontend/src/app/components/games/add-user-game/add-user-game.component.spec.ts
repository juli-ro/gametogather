import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserGameComponent } from './add-user-game.component';

describe('AddUserGameComponent', () => {
  let component: AddUserGameComponent;
  let fixture: ComponentFixture<AddUserGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
