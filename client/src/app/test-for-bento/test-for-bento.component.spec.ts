import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestForBentoComponent } from './test-for-bento.component';

describe('TestForBentoComponent', () => {
  let component: TestForBentoComponent;
  let fixture: ComponentFixture<TestForBentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestForBentoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestForBentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
