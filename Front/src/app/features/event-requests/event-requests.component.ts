import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ClubRequestService } from '../../services/club-request.service';

@Component({
  standalone: true,
  imports: [CardComponent, CommonModule, ReactiveFormsModule],
  selector: 'app-event-requests',
  templateUrl: './event-requests.component.html',
  styleUrls: ['./event-requests.component.scss'],
  providers: [DatePipe]
})
export class EventRequestsComponent implements OnInit {
  eventForm = this.fb.group({
    club_id: ['', [Validators.required, Validators.min(1)]],
    event_name: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    location: ['', Validators.required],
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
    financial_request: [false],
    requested_amount: [0, [Validators.min(0)]],
    attendees: [0, [Validators.min(0)]],
    need_equipment: [false],
    equipment_description: ['']
  });

  equipmentOptions = [
    'Projecteur',
    'Écran',
    'Microphone',
    'Enceintes',
    'Table',
    'Chaise',
    'Multiprise',
    'Câbles HDMI',
    'Ordinateur portable'
  ];

  eventTypes = ['CONFERENCE', 'WORKSHOP', 'SEMINAR', 'COMPETITION', 'SOCIAL_EVENT'];

  statusCards = [
    { title: 'En attente', value: 0, icon: 'hourglass', color: 'bg-warning' },
    { title: 'Approuvées', value: 0, icon: 'check-circle', color: 'bg-success' },
    { title: 'Rejetées', value: 0, icon: 'times-circle', color: 'bg-danger' },
    { title: 'Total', value: 0, icon: 'list-alt', color: 'bg-info' }
  ];

  recentRequests: any[] = [];
  isLoading = false;
  isSubmitting = false;
  alert: { type: 'success' | 'danger' | 'info', message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private clubRequestService: ClubRequestService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadEventRequests();
  }

  loadEventRequests(): void {
    this.isLoading = true;
    this.clubRequestService.getEventRequests().subscribe({
      next: (requests) => {
        this.recentRequests = requests;
        this.updateStatusCards(requests);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.isLoading = false;
        this.showAlert('danger', 'Erreur lors du chargement des demandes');
      }
    });
  }

  trackByFn(index: number, item: any): any {
    return item?.title || index;
  }

  updateStatusCards(requests: any[]): void {
    this.statusCards = [
      {
        ...this.statusCards[0],
        value: requests.filter(r => r.status === 'PENDING').length
      },
      {
        ...this.statusCards[1],
        value: requests.filter(r => r.status === 'APPROVED').length
      },
      {
        ...this.statusCards[2],
        value: requests.filter(r => r.status === 'REJECTED').length
      },
      {
        ...this.statusCards[3],
        value: requests.length
      }
    ];
  }

  onSubmit(): void {
    if (this.eventForm.invalid || this.isSubmitting) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = {
      eventName: this.eventForm.value.event_name!,
      type: this.eventForm.value.type!,
      description: this.eventForm.value.description!,
      location: this.eventForm.value.location!,
      startDate: new Date(this.eventForm.value.start_date!).toISOString(),
      endDate: new Date(this.eventForm.value.end_date!).toISOString(),
      financialRequest: this.eventForm.value.financial_request!,
      requestedAmount: this.eventForm.value.requested_amount || 0,
      estimatedAttendees: this.eventForm.value.attendees || 0,
      needEquipment: this.eventForm.value.need_equipment!,
      equipmentDescription: this.eventForm.value.equipment_description,
      status: 'PENDING',
      club: { id: Number(this.eventForm.value.club_id) }
    };

    this.clubRequestService.createEventRequest(formData).subscribe({
      next: (response) => {
        this.showAlert('success', 'Demande envoyée avec succès.');
        this.eventForm.reset({
          financial_request: false,
          requested_amount: 0,
          attendees: 0,
          need_equipment: false,
          equipment_description: ''
        });
        this.loadEventRequests();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erreur lors de la soumission:', err);
        this.showAlert('danger', 'Erreur lors de l\'envoi de la demande.');
        this.isSubmitting = false;
      }
    });
  }

  approveRequest(id: number): void {
    this.clubRequestService.approveEventRequest(id).subscribe({
      next: () => {
        this.loadEventRequests();
        this.showAlert('success', 'Demande approuvée avec succès.');
      },
      error: (err) => {
        console.error('Erreur lors de l\'approbation:', err);
        this.showAlert('danger', 'Erreur lors de l\'approbation.');
      }
    });
  }

  rejectRequest(id: number): void {
    this.clubRequestService.rejectEventRequest(id).subscribe({
      next: () => {
        this.loadEventRequests();
        this.showAlert('success', 'Demande rejetée avec succès.');
      },
      error: (err) => {
        console.error('Erreur lors du rejet:', err);
        this.showAlert('danger', 'Erreur lors du rejet.');
      }
    });
  }

  trackByRequest(index: number, request: any): number {
    return request.id || index;
  }

  showAlert(type: 'success' | 'danger' | 'info', message: string): void {
    this.alert = { type, message };
    setTimeout(() => this.alert = null, 5000);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }
}
