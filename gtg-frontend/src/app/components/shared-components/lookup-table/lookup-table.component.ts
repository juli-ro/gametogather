import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ILookupBase} from '../../../models/lookupBase';

@Component({
  selector: 'app-lookup-table',
  imports: [],
  templateUrl: './lookup-table.component.html',
  styleUrl: './lookup-table.component.scss',
  standalone: true,

})
export class LookupTableComponent {

  @Input() lookupItem: ILookupBase[] = [];
  @Input() canGoToDetail: boolean = false;
  @Output() itemChanged = new EventEmitter<ILookupBase>();
  @Output() goToDetailPage = new EventEmitter<string>();
  selectedItem: ILookupBase | null = null;

  ngOnChanges(): void {
    if (this.lookupItem?.length > 0) {
      this.selectedItem = this.lookupItem[0];
    }
  }

  selectItem(item: ILookupBase): void {
    this.selectedItem = item;
    this.itemChanged.emit(item)
  }

  onGoToDetailPage(itemId: string): void {
    this.goToDetailPage.emit(itemId)
  }
}
