import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeclubadminComponent } from './demandeclubadmin.component';

describe('DemandeclubadminComponent', () => {
  let component: DemandeclubadminComponent;
  let fixture: ComponentFixture<DemandeclubadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeclubadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeclubadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
