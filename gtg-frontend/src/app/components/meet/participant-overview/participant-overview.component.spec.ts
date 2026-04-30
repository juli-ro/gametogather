import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ParticipantOverviewComponent } from "./participant-overview.component";

describe("ParticipantOverviewComponent", () => {
	let component: ParticipantOverviewComponent;
	let fixture: ComponentFixture<ParticipantOverviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ParticipantOverviewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ParticipantOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
