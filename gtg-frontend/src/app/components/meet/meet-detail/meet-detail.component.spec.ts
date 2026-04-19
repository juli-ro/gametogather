import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetDetailComponent } from './meet-detail.component';

describe('MeetDetailComponent', () => {
  let component: MeetDetailComponent;
  let fixture: ComponentFixture<MeetDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
