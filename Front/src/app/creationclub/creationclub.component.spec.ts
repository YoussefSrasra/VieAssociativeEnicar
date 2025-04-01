import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationclubComponent } from './creationclub.component';

describe('CreationclubComponent', () => {
  let component: CreationclubComponent;
  let fixture: ComponentFixture<CreationclubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationclubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationclubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
