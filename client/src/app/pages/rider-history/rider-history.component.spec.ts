import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderHistoryComponent } from './rider-history.component';

describe('RiderHistoryComponent', () => {
  let component: RiderHistoryComponent;
  let fixture: ComponentFixture<RiderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RiderHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RiderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
