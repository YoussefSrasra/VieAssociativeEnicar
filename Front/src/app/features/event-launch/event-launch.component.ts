import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-launch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './event-launch.component.html',
  styleUrls: ['./event-launch.component.scss']
})
export class EventLaunchComponent {
  // Déclaré avant l'initialisation du formulaire
  committeeTypes = [
    'Comité Organisation',
    'Comité Logistique',
    'Comité Communication',
    'Comité Sponsoring'
  ];

  eventTypes = [
    'Conférence',
    'Atelier',
    'Hackathon',
    'Compétition',
    'Séminaire',
    'Réseautage'
  ];

  eventForm = this.fb.nonNullable.group({
    event_name: ['', Validators.required],
    event_type: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    description: ['', Validators.required],
    committees: this.fb.array<FormControl<boolean>>(
      this.committeeTypes.map(() => this.fb.nonNullable.control(false))
    ),
    max_participants: [''],
    requirements: ['']
  });

  constructor(private fb: FormBuilder) {}

  // Getter typé pour le FormArray
  get committeesArray(): FormArray<FormControl<boolean>> {
    return this.eventForm.controls.committees;
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = {
        ...this.eventForm.getRawValue(),
        selected_committees: this.getSelectedCommittees()
      };
      console.log('Événement créé:', formData);
    }
  }

  getSelectedCommittees(): string[] {
    return this.committeeTypes
      .filter((_, i) => this.committeesArray.at(i).value);
  }
}
