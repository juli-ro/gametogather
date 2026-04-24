import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCatalogGameComponent } from './add-catalog-game.component';

describe('AddCatalogGameComponent', () => {
  let component: AddCatalogGameComponent;
  let fixture: ComponentFixture<AddCatalogGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCatalogGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCatalogGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
