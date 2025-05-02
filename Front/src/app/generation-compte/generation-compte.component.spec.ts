import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationCompteComponent } from './generation-compte.component';

describe('GenerationCompteComponent', () => {
  let component: GenerationCompteComponent;
  let fixture: ComponentFixture<GenerationCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationCompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
