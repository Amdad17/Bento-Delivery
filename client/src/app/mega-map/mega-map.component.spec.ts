import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MegaMapComponent } from './mega-map.component';

describe('MegaMapComponent', () => {
  let component: MegaMapComponent;
  let fixture: ComponentFixture<MegaMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MegaMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MegaMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
