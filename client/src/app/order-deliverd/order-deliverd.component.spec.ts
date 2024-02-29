import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeliverdComponent } from './order-deliverd.component';

describe('OrderDeliverdComponent', () => {
  let component: OrderDeliverdComponent;
  let fixture: ComponentFixture<OrderDeliverdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDeliverdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDeliverdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
