import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConformAnimationComponent } from './order-conform-animation.component';

describe('OrderConformAnimationComponent', () => {
  let component: OrderConformAnimationComponent;
  let fixture: ComponentFixture<OrderConformAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderConformAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderConformAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
