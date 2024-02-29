import { Component, OnInit } from '@angular/core';
import lottie from 'lottie-web';
import navigatinAnimation from '../../assets/json/bikeRider.json';
import { Router } from '@angular/router';
import { MapService } from '../services/map.service';
import { HubResponse, IHub } from '../interfaces/IHub.interface';

@Component({
  selector: 'app-navigation-amination',
  templateUrl: './navigation-amination.component.html',
  styleUrl: './navigation-amination.component.css',
})
export class NavigationAminationComponent implements OnInit {
  riderId: string | null = '';
  hub!: HubResponse;

  ngOnInit(): void {
    const container = document.getElementById('lottie-container') as Element;
    lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: navigatinAnimation,
    });
    this.getRiderId();
    this.getHub();
    //eslint-disable-next-line
    // this.goMap();
  }

  constructor(
    private router: Router,
    private mapboxService: MapService,
  ) {}
  getRiderId() {
    this.riderId = localStorage.getItem('riderId');
  }
  async goMap() {
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
  }

  getHub() {
    // eslint-disable-next-line
    this.mapboxService.assignHub(this.riderId).subscribe((data: any) => {
      this.hub = data;
      console.log('data from navigation', this.hub);
      // localStorage.setItem("HubInfo", this.hub)
      if (this.hub) {
        // eslint-disable-next-line
        this.goMap();
      }
    });
  }
}
