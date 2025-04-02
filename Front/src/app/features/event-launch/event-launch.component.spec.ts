import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLaunchComponent } from './event-launch.component';

describe('EventLaunchComponent', () => {
  let component: EventLaunchComponent;
  let fixture: ComponentFixture<EventLaunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventLaunchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
