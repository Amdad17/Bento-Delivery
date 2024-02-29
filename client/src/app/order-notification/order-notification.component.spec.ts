import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNotificationComponent } from './order-notification.component';

describe('OrderNotificationComponent', () => {
  let component: OrderNotificationComponent;
  let fixture: ComponentFixture<OrderNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderNotificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
