import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationAminationComponent } from './navigation-amination.component';

describe('NavigationAminationComponent', () => {
  let component: NavigationAminationComponent;
  let fixture: ComponentFixture<NavigationAminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationAminationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationAminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
