import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCertificatComponent } from './participant-certificat.component';

describe('ParticipantCertificatComponent', () => {
  let component: ParticipantCertificatComponent;
  let fixture: ComponentFixture<ParticipantCertificatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantCertificatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantCertificatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
