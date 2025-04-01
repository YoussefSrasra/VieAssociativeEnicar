import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-event-requests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent
  ],
  templateUrl: './event-requests.component.html',
  styleUrls: ['./event-requests.component.scss']
})
export class EventRequestsComponent {
  eventForm = this.fb.group({
    event_name: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    location: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    financial_request: [false],
    requested_amount: [{ value: '', disabled: true }, [Validators.pattern(/^\d+$/)]],
    attendees: [''],
    status: ['pending']
  });

  eventTypes = [
    'Conférence',
    'Atelier',
    'Compétition',
    'Exposition',
    'Réunion',
    'Autre'
  ];

  statusCards = [
    {
      title: 'Demandes en attente',
      value: '12',
      icon: 'hourglass',
      color: 'bg-warning',
      border: 'border-warning'
    },
    {
      title: 'Demandes approuvées',
      value: '24',
      icon: 'check-circle',
      color: 'bg-success',
      border: 'border-success'
    },
    {
      title: 'Demandes rejetées',
      value: '3',
      icon: 'times-circle',
      color: 'bg-danger',
      border: 'border-danger'
    },
    {
      title: 'Total demandes',
      value: '39',
      icon: 'file-alt',
      color: 'bg-info',
      border: 'border-info'
    }
  ];

  recentRequests = [
    { id: 'REQ-001', event_name: 'Conférence Tech', start_date: '15/06/2023', status: 'Approuvé' },
    { id: 'REQ-002', event_name: 'Séminaire', start_date: '10/06/2023', status: 'En attente' },
    { id: 'REQ-003', event_name: 'Team Building', start_date: '05/06/2023', status: 'Rejeté' }
  ];

  constructor(private fb: FormBuilder) {
    this.eventForm.get('financial_request')?.valueChanges.subscribe(needsFunding => {
      const amountControl = this.eventForm.get('requested_amount');
      needsFunding ? amountControl?.enable() : amountControl?.disable();
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = {
        ...this.eventForm.value,
        club_id: 123 // À remplacer par l'ID réel du club
      };
      console.log('Données à envoyer:', formData);
      // Ici vous ajouterez l'appel à votre service API
    }
  }

  get f() {
    return this.eventForm.controls;
  }
}
