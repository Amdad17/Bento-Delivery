import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RiderInfo } from '../../interfaces/IRider.interface';
import { MapService } from '../../services/map/map.service';

@Component({
  selector: 'app-order-notification',
  templateUrl: './order-notification.component.html',
  styleUrl: './order-notification.component.css',
})
export class OrderNotificationComponent implements OnInit {
  // eslint-disable-next-line no-unused-vars
  constructor(
    private mapboxService: MapService,
    private router: Router,
  ) {}

  @Input() riderInfo!: RiderInfo;

  orderCount!: number;
  countdownValueFromUI!: number;
  //For disable button
  pickup!: boolean;
  deliver!: boolean;
  maxTime!: Date;

  ngOnInit(): void {
    this.getRiderId();
    if (this.riderInfo && this.riderInfo.rider) {
      this.orderCount = this.riderInfo.rider.currentOrderList.length;
      this.riderInfo.rider.travelTime = 30;
      this.countdownValueFromUI = Math.floor(this.riderInfo.rider.travelTime);
      this.Countdown(Math.floor(this.riderInfo.rider.travelTime));
    }

    // Ensure only the "Pick Up" button is initially enabled
    this.pickup = true;
    this.deliver = false;
  }

  riderId: string | null = '';
  getRiderId() {
    this.riderId = localStorage.getItem('riderId');
  }
  async GoToRiderMap() {
    try {
      // eslint-disable-next-line no-unused-vars
      await this.router.navigate(['/ridermap']);
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) console.log('error');
    }
  }

  pickUpOrder() {
    this.startCountdown(this.countdownValueFromUI);
    this.mapboxService
      .updateOrderStatus(this.riderId)
      // eslint-disable-next-line
      .subscribe((data: any) => {
        if (data) {
          this.pickup = false;
        }
      });
  }
  orderDeliver() {
    this.mapboxService
      .updateOrderStatus(this.riderId)
      // eslint-disable-next-line
      .subscribe((data: any) => {
        if (data) {
          this.deliver = false;
        }
      });
  }

  //For countdown

  startCountdown(durationInSeconds: number): void {
    let timer: ReturnType<typeof setInterval> | null = null;

    const displayCountdown = (minutes: number, seconds: number) => {
      const countdownElement = document.getElementById('countdown');
      if (countdownElement) {
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const tick = () => {
      if (durationInSeconds <= 0) {
        stopTimer();
        return;
      }
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      displayCountdown(minutes, seconds);
      durationInSeconds--;
    };

    tick(); // Display initial countdown immediately

    timer = setInterval(tick, 1000); // Update countdown every second
  }

  setTime: string = '';
  Countdown(durationInSeconds: number): void {
    let timer: ReturnType<typeof setInterval> | null = null;

    const displayCountdown = (minutes: number, seconds: number) => {
      const countdownElement = document.getElementById('countdown');
      if (countdownElement) {
        this.setTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const tick = () => {
      if (durationInSeconds <= 0) {
        stopTimer();
        return;
      }

      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      displayCountdown(minutes, seconds);
    };

    tick(); // Display initial countdown immediately

    timer = setInterval(tick, 1000); // Update countdown every second
  }
}
