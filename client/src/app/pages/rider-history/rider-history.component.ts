import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-rider-history',
  templateUrl: './rider-history.component.html',
  styleUrl: './rider-history.component.css',
})
export class RiderHistoryComponent {
  @Output() notifyParent = new EventEmitter();

  closeForRideHistory() {
    this.notifyParent.emit();
  }
}
