import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackEvenementComponent } from './feedback-evenement.component';

describe('FeedbackEvenementComponent', () => {
  let component: FeedbackEvenementComponent;
  let fixture: ComponentFixture<FeedbackEvenementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackEvenementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackEvenementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
