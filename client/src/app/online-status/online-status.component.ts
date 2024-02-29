import { Component, Input, OnInit } from '@angular/core';
import { RiderInfo } from '../interfaces/IRider.interface';

@Component({
  selector: 'app-online-status',
  templateUrl: './online-status.component.html',
  styleUrl: './online-status.component.css',
})
export class OnlineStatusComponent implements OnInit {
  ngOnInit(): void {
    console.log('from child', this.riderInfo.rider.riderImage);
  }

  @Input() riderInfo!: RiderInfo;

  getVehicleImageSrc(vehicleType: string): string {
    if (vehicleType === 'Bike') {
      return '../../assets/images/scooter-removebg.png';
    } else if (vehicleType === 'Cycle') {
      return '../../assets/images/cycle-removebg.png';
    } else {
      return '../../assets/images/scooter-removebg.png';
    }
  }
}
