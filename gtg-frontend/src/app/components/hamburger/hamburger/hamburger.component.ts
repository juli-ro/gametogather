import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
	selector: "app-hamburger",
	imports: [],
	templateUrl: "./hamburger.component.html",
	styleUrl: "./hamburger.component.scss",
	standalone: true,
})
export class HamburgerComponent implements OnInit {
	//Todo: fix inputs to be signal inputs and outputs
	@Input() initialState = false;
	@Input() closed?: Observable<void>;
	@Output() trigger: EventEmitter<void> = new EventEmitter<void>();

	active = false;

	ngOnInit(): void {
		this.active = this.initialState || false;

		if (this.closed) {
			this.closed.subscribe(() => (this.active = false));
		}
	}

	triggered(): void {
		this.active = !this.active;
		this.trigger.emit();
	}
}
