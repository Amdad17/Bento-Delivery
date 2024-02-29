import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RiderInfo } from '../interfaces/IRider.interface';

@Component({
  selector: 'app-order-notification',
  templateUrl: './order-notification.component.html',
  styleUrl: './order-notification.component.css',
})
export class OrderNotificationComponent implements OnInit {
  // eslint-disable-next-line no-unused-vars
  constructor(private router: Router) {
    // this.startTimer(5*60);
  }

  @Input() riderInfo!: RiderInfo;

  orderCount!: number;
  countdownValueFromUI!: number;

  //For disable button
  pickup!: boolean;
  deliver!: boolean;

  ngOnInit(): void {
    this.getRiderId();
    if (this.riderInfo && this.riderInfo.rider) {
      this.orderCount = this.riderInfo.rider.currentOrderList.length;
      console.log(this.riderInfo.rider.travelTime);
      // Example usage:
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
      console.log('error');
    }
  }

  pickUpOrder() {
    console.log('click');
    this.startCountdown(this.countdownValueFromUI);
    this.pickup = false;
    this.deliver = true;
  }

  async orderDeliver() {
    try {
      await this.router.navigate(['/orderStatus']);
      // Delay for 5 seconds
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            await this.router.navigate([this.riderId + '/ridermap']);
          } catch (error) {
            console.log('Error navigating to /animation2:', error);
            resolve();
          }
        }, 6000);
      });
    } catch (error) {
      console.log('Error navigating to /orderStatus:', error);
    }
    // this.pickup = true;
    // this.deliver = false;
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
        console.log('Countdown complete!');
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

  setTime!: string;
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
        console.log('Countdown complete!');
        return;
      }

      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      displayCountdown(minutes, seconds);
      // durationInSeconds--;
    };

    tick(); // Display initial countdown immediately

    timer = setInterval(tick, 1000); // Update countdown every second
  }
}
