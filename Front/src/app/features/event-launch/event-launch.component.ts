import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidatureService } from '../../services/candidature.service';

@Component({
  selector: 'app-event-launch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './event-launch.component.html',
  styleUrls: ['./event-launch.component.scss']
})
export class EventLaunchComponent {
  max_participants?: number | string;  // Accept both types

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

  constructor(
    private fb: FormBuilder,
    private eventService: CandidatureService
  ) {}

  get committeesArray(): FormArray<FormControl<boolean>> {
    return this.eventForm.controls.committees;
  }
  eventData: any[] = [];  // Pour stocker les événements soumis

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formData = {
        ...this.eventForm.getRawValue(),
        selected_committees: this.getSelectedCommittees(),
        max_participants: this.eventForm.value.max_participants
          ? Number(this.eventForm.value.max_participants)
          : undefined
      };

      // Appel du service pour transmettre l'événement
      this.eventService.addEvent(formData).subscribe(response => {
        console.log('Événement soumis:', response);
        this.eventData.push(response);  // Ajouter l'événement soumis à la liste
      });
      this.eventForm.reset();
    }
  }

  private getSelectedCommittees(): string[] {
    return this.committeeTypes
      .filter((_, i) => this.committeesArray.at(i).value);
  }
}
