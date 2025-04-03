import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubaccueilComponent } from './clubaccueil.component';

describe('ClubaccueilComponent', () => {
  let component: ClubaccueilComponent;
  let fixture: ComponentFixture<ClubaccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubaccueilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubaccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
