import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RiderInfo } from '../../interfaces/IRider.interface';

@Component({
  selector: 'app-rider-profile',
  templateUrl: './rider-profile.component.html',
  styleUrl: './rider-profile.component.css',
})
export class RiderProfileComponent {
  @Input() riderInfo!: RiderInfo;
  @Output() notifyParent = new EventEmitter();

  closeForRiderProfile() {
    this.notifyParent.emit();
  }

  //For Edit Profile
  visibleForEdit: boolean = false;
  openForEdit(): void {
    this.visibleForEdit = true;
  }

  closeForEdit(): void {
    this.visibleForEdit = false;
  }
}
