import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ClubRequestService } from '../services/club-request.service';
import { ParticipantService } from '../services/participant.service';
// src/types/event-request.ts
export interface EventRequest {
  id?: number;
  eventName: string;
  type: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  financialRequest: boolean;
  requestedAmount?: number;
  estimatedAttendees?: number;
  needEquipment: boolean;
  equipmentDescription?: string;
  status?: string;
  club: {
    id: number;
    name?: string;
  };
}
@Component({
  selector: 'app-member-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss'],
  providers: [DatePipe],
})
export class MemberDashboardComponent implements OnInit {
  approvedEvents: EventRequest[] = [];
  isLoading = true;
  selectedEvent: EventRequest | null = null;
  formData: any = {};
  alert: { type: 'success' | 'danger', message: string } | null = null;

  constructor(
    private clubRequestService: ClubRequestService,
    private participantService: ParticipantService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadApprovedEvents();
  }

  loadApprovedEvents(): void {
    this.isLoading = true;
    this.clubRequestService.getEventRequests().subscribe({
      next: (requests) => {
        // Filtrer les événements approuvés
        this.approvedEvents = requests.filter(
          (request) => request.status === 'APPROVED' && this.canParticipate(request)
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements:', err);
        this.isLoading = false;
        this.showAlert('danger', 'Erreur lors du chargement des événements.');
      },
    });
  }

  canParticipate(event: EventRequest): boolean {
    const endDate = new Date(event.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= today;
  }

  openParticipationForm(event: EventRequest): void {
    this.selectedEvent = event;
    this.formData.eventName = event.eventName;
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.selectedEvent) {
      this.participantService.registerParticipant(this.formData).subscribe({
        next: (response) => {
          this.showAlert('success', 'Inscription réussie !');
          form.resetForm();
          this.selectedEvent = null;
        },
        error: (err) => {
          console.error('Erreur lors de l\'inscription:', err);
          this.showAlert('danger', 'Une erreur est survenue lors de l\'inscription.');
        },
      });
    }
  }

  showAlert(type: 'success' | 'danger', message: string): void {
    this.alert = { type, message };
    setTimeout(() => (this.alert = null), 5000);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }
}
