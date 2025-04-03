import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ClubRequestService } from '../../services/club-request.service';

@Component({
  selector: 'app-event-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, DatePipe],
  templateUrl: './event-requests.component.html',
  styleUrls: ['./event-requests.component.scss']
})
export class EventRequestsComponent implements OnInit {
  eventForm = this.fb.group({
    event_name: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    location: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    financial_request: [false],
    requested_amount: [{ value: 0, disabled: true }, [Validators.min(0)]],
    attendees: [0, [Validators.min(0)]],
    status: ['Pending']
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
    { title: 'En attente', value: '0', icon: 'hourglass', color: 'bg-warning' },
    { title: 'Approuvées', value: '0', icon: 'check-circle', color: 'bg-success' },
    { title: 'Rejetées', value: '0', icon: 'times-circle', color: 'bg-danger' },
    { title: 'Total', value: '0', icon: 'list-alt', color: 'bg-info' }
  ];

  recentRequests: any[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private requestService: ClubRequestService,
  ) {
    this.eventForm.get('financial_request')?.valueChanges.subscribe(checked => {
      const amountControl = this.eventForm.get('requested_amount');
      checked ? amountControl?.enable() : amountControl?.disable();
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.requestService.getAllRequests().subscribe({
      next: (requests) => {
        this.recentRequests = requests;
        this.updateStatusCards(requests);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  updateStatusCards(requests: any[]): void {
    const pending = requests.filter(r => r.status === 'Pending').length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;

    this.statusCards = [
      { ...this.statusCards[0], value: pending.toString() },
      { ...this.statusCards[1], value: approved.toString() },
      { ...this.statusCards[2], value: rejected.toString() },
      { ...this.statusCards[3], value: requests.length.toString() }
    ];
  }

  isSubmitting = false; // Ajoutez cette propriété à votre composant

onSubmit(): void {
  // Bloquer les soumissions multiples
  if (this.isSubmitting) return;

  console.log('Tentative de soumission'); // Debug

  if (this.eventForm.invalid) {
    console.log('Formulaire invalide', this.eventForm.errors);
    this.eventForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.isLoading = true;

  const formData = {
    eventName: this.eventForm.value.event_name,
    type: this.eventForm.value.type,
    description: this.eventForm.value.description,
    location: this.eventForm.value.location,
    startDate: this.formatDateForAPI(this.eventForm.value.start_date),
    endDate: this.formatDateForAPI(this.eventForm.value.end_date),
    financialRequest: this.eventForm.value.financial_request,
    requestedAmount: this.eventForm.value.financial_request ? this.eventForm.value.requested_amount : 0,
    attendees: this.eventForm.value.attendees,
    status: 'Pending',
    committeeTypes: [],
    club: { id: 1 }
  };

  console.log('Données à envoyer:', formData); // Debug propre

  this.requestService.createRequest(formData).subscribe({
    next: () => {
      console.log('Soumission réussie');
      this.isSubmitting = false;
      this.isLoading = false;

      this.eventForm.reset({
        financial_request: false,
        requested_amount: 0,
        attendees: 0,
        status: 'Pending'
      });

      // Retardez légèrement le rechargement si nécessaire
      setTimeout(() => this.loadData(), 100);
    },
    error: (err) => {
      console.error('Erreur:', err);
      this.isSubmitting = false;
      this.isLoading = false;
    }
  });
}
  approveRequest(id: number): void {
    this.requestService.approveRequest(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  rejectRequest(id: number): void {
    this.requestService.rejectRequest(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private formatDateForAPI(dateString: string | null | undefined): string {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  }
}
