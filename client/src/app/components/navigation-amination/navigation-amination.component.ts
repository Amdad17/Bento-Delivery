import { Component, OnInit } from '@angular/core';
import lottie from 'lottie-web';
import navigatinAnimation from '../../../assets/json/bikeRider.json';
import { Router } from '@angular/router';
import { MapService } from '../../services/map/map.service';
import { HubResponse } from '../../interfaces/IHub.interface';

@Component({
  selector: 'app-navigation-amination',
  templateUrl: './navigation-amination.component.html',
  styleUrl: './navigation-amination.component.css',
})
export class NavigationAminationComponent implements OnInit {
  riderId: string | null = '';
  onlineStatus: boolean = true;
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
  }

  constructor(
    private router: Router,
    private mapboxService: MapService,
  ) {}
  getRiderId() {
    this.riderId = localStorage.getItem('riderId');
    if (this.riderId) {
      this.mapboxService
        .editRider(this.riderId, this.onlineStatus)
        // eslint-disable-next-line
        .subscribe((data: any) => {
          if (data) {
            // eslint-disable-next-line
            this.getHub();
          }
        });
    }
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
    this.mapboxService.assignHub(this.riderId).subscribe(
      // eslint-disable-next-line
      (data: any) => {
        this.hub = data;
        if (this.hub) {
          // eslint-disable-next-line
          this.goMap();
        }
      },
      (error: Error) => {
        // eslint-disable-next-line
        this.goMap();
      },
    );
  }
}
