import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GirlSearchingAnimationComponent } from './girl-searching-animation.component';

describe('GirlSearchingAnimationComponent', () => {
  let component: GirlSearchingAnimationComponent;
  let fixture: ComponentFixture<GirlSearchingAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GirlSearchingAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GirlSearchingAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
