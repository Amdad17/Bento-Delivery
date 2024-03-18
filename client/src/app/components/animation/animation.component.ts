import { Component, OnInit } from '@angular/core';
import lottie from 'lottie-web';
import bikeData from '../../../assets/json/bikeEdited.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrl: './animation.component.css',
})
export class AnimationComponent implements OnInit {
  onlineStatus: boolean = true;
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

  async goOnline() {
    // eslint-disable-next-line
    try {
      await this.router.navigate(['/searchHub']);
      location.reload();
    } catch (error) {
      console.log('Error navigating to /orderStatus:', error);
    }
  }
}
