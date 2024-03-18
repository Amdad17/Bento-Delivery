import { Component, OnInit } from '@angular/core';
import lottie from 'lottie-web';
import orderConfirm from '../../../assets/json/movingrider.json';

@Component({
  selector: 'app-order-conform-animation',
  templateUrl: './order-conform-animation.component.html',
  styleUrl: './order-conform-animation.component.css',
})
export class OrderConformAnimationComponent implements OnInit {
  ngOnInit(): void {
    const container = document.getElementById('lottie-container') as Element;
    lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: orderConfirm,
    });
  }
}
