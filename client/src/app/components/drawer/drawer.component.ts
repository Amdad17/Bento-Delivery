import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css'],
})
export class DrawerComponent implements OnInit {
  size: 'large' | 'default' = 'default';

  ngOnInit(): void {
    this.open();
  }
  showLarge(): void {
    this.size = 'large';
  }

  visible: boolean = false;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  visibleForSignin: boolean = false;
  openForSignin(): void {
    this.visibleForSignin = true;
  }

  closeForSignin(): void {
    this.visibleForSignin = false;
  }

  visibleForSignup: boolean = false;
  openForSignup(): void {
    this.visibleForSignup = true;
  }

  closeForSignup(): void {
    this.visibleForSignup = false;
  }
}
