import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCatalogGameComponent } from './edit-catalog-game.component';

describe('EditCatalogGameComponent', () => {
  let component: EditCatalogGameComponent;
  let fixture: ComponentFixture<EditCatalogGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCatalogGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCatalogGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
