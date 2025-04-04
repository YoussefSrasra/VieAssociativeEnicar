import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipListComponent } from './partnership-list.component';

describe('PartnershipListComponent', () => {
  let component: PartnershipListComponent;
  let fixture: ComponentFixture<PartnershipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnershipListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnershipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
