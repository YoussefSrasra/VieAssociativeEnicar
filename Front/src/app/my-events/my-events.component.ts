import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ClubRequestService } from 'src/app/services/club-request.service';

interface EventRequestDTO {
  id: number;
  nom: string;
  type: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  clubName: string;
}

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {
  myEvents: EventRequestDTO[] = [];
  isLoading = false;
  error = '';

  constructor(private requestService: ClubRequestService) {}

  ngOnInit(): void {
    this.loadMyEvents();
  }

  loadMyEvents(): void {
    this.isLoading = true;
    const participationIds = JSON.parse(localStorage.getItem('myParticipations') || '[]') as number[];

    if (participationIds.length === 0) {
      this.myEvents = [];
      this.isLoading = false;
      return;
    }

    this.requestService.getEventsByIds(participationIds).subscribe({
      next: (events) => {
        this.myEvents = events;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements:', err);
        this.error = 'Erreur lors du chargement des événements.';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(dateString, 'dd/MM/yyyy HH:mm') || '';
  }
}
