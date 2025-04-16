import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContactsUrgenceComponent } from './gestion-contacts-urgence.component';

describe('GestionContactsUrgenceComponent', () => {
  let component: GestionContactsUrgenceComponent;
  let fixture: ComponentFixture<GestionContactsUrgenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionContactsUrgenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionContactsUrgenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
