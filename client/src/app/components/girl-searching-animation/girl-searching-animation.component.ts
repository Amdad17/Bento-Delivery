import { Component, OnInit } from '@angular/core';
import lottie from 'lottie-web';
import girl from '../../../assets/json/girledit.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-girl-searching-animation',
  templateUrl: './girl-searching-animation.component.html',
  styleUrl: './girl-searching-animation.component.css',
})
export class GirlSearchingAnimationComponent implements OnInit {
  ngOnInit(): void {
    const container = document.getElementById('lottie-container') as Element;
    lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: girl,
    });
  }

  // eslint-disable-next-line no-unused-vars
  constructor(private router: Router) {}

  async goToNextPage() {
    await this.router.navigate(['animation']);
  }
}
