import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupTableComponent } from './lookup-table.component';

describe('LookupTableComponent', () => {
  let component: LookupTableComponent;
  let fixture: ComponentFixture<LookupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LookupTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LookupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
