import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CandidatureService } from '../../services/candidature.service';
import { EventLaunchService } from '../../services/event-launch.service';

@Component({
  selector: 'app-event-launch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './event-launch.component.html',
  styleUrls: ['./event-launch.component.scss']
})
export class EventLaunchComponent {
  max_participants?: number | string;  // Accept both types
  successMessage = '';
  errorMessage = '';

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
    club_name: [''] // Remplace requirements par club_name
  });

  constructor(
    private fb: FormBuilder,
    private eventService: EventLaunchService
  ) {}
  private createCommitteeControls() {
    return Array(4).fill(false).map(() => this.fb.control(false));
  }


  eventData: any[] = [];  // Pour stocker les événements soumis

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: (res) => {
          console.log('Success:', res);
          this.showSuccessAlert();
          this.resetForm();
        },
        error: (err) => this.showErrorAlert(err)
      });
    }
  }
  getCommitteeControl(index: number): FormControl {
    return this.committeesArray.at(index) as FormControl;
  }
  get committeesArray() {
    return this.eventForm.get('committees') as FormArray;
  }

  private resetForm(): void {
    this.eventForm.reset();
    this.committeesArray.controls.forEach(control => control.setValue(false));
  }

  private showSuccessAlert(): void {
    this.successMessage = 'Événement créé avec succès ! 🎉';
    this.errorMessage = '';
    
    // Scroll to top avec animation smooth
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    setTimeout(() => this.successMessage = '', 3000); // Disparaît après 3s
}

  private showErrorAlert(error: any): void {
    this.errorMessage = error.message || 'Une erreur est survenue ❌';
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 4000);
  }

}
