import { Component, OnInit } from '@angular/core';
import lottie from 'lottie-web';
import bikeData from '../../assets/json/bikeEdited.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.css',
})
export class AnimationComponent implements OnInit {
  riderId: string | null = '';
  ngOnInit(): void {
    const container = document.getElementById('lottie-container') as Element;
    lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: bikeData,
    });
    this.getRiderId();
  }
  constructor(private router: Router) {}

  getRiderId() {
    this.riderId = localStorage.getItem('riderId');
  }

  // goOnline() {
  //   console.log(this.riderId);
  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   this.router.navigate([this.riderId + '/ridermap']);
  //   // this.router.navigate(['ridermap']);
  // }

  async goOnline() {
    console.log(this.riderId);

    try {
      // setTimeout(async ()=>{
      await this.router.navigate(['/animation2']);
      location.reload();
      // },1000)
      // Delay for 5 seconds
      // await new Promise<void>((resolve) => {
      //   setTimeout(async () => {
      //     try {
      //       await this.router.navigate([this.riderId + '/ridermap']);
      //     } catch (error) {
      //       console.log('Error navigating to /animation2:', error);
      //       resolve();
      //     }
      //   }, 6000);
      // });
    } catch (error) {
      console.log('Error navigating to /orderStatus:', error);
    }
  }

  // async goOnline() {
  //   console.log(this.riderId);

  //   try {
  //     await this.router.navigate(['/animation2']);
  //     // Delay for 5 seconds
  //     // await this.delay(10000);

  //     // After the delay, navigate to the next route
  //     // await this.router.navigate([this.riderId + '/ridermap']);
  //   } catch (error) {
  //     console.log('Error navigating:', error);
  //   }
  // }

  // delay(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }
}
