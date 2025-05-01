import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ParticipantService } from '../services/participant.service';
import { EventLaunchService } from '../services/event-launch.service';
import { ClubAccueilComponent } from 'src/app/clubaccueil/clubaccueil.component';
import { CreationClubComponent } from '../creationclub/creationclub.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

export interface Event {
  id: number;
  eventName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  description: string;
  clubName: string;
  committees: string[];
  maxParticipants?: number;
  createdAt?: string;
}

@Component({
  selector: 'app-accueil',
  imports: [
    RouterModule,
    CreationClubComponent,
    FormsModule,
    CommonModule,
    ClubAccueilComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
})
export class AccueilComponent implements OnInit {
  activeSection: string = 'hero';
  allEvents: Event[] = [];
  isLoading = true;
  formData: any = {};
  selectedEvent: Event | null = null;
  showModal: boolean = false;
  modalEvent: Event | null = null;

  constructor(
    private eventService: EventLaunchService,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = ['hero', 'about', 'services', 'events'];
    const scrollPosition = window.scrollY + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  loadAllEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        console.log('Events received:', events);
        this.allEvents = events;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      },
    });
  }

  canParticipate(event: Event): boolean {
    const endDate = new Date(event.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return endDate > today;
  }

  openParticipationForm(event: Event): void {
    this.selectedEvent = event;
    this.formData.eventName = event.eventName;
  }

  openEventDetails(event: Event): void {
    this.modalEvent = event;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.modalEvent = null;
  }

  onSubmit(form: NgForm): void {
    if (form.valid && this.selectedEvent) {
      this.participantService.registerParticipant(this.formData).subscribe({
        next: (response) => {
          alert('Inscription réussie !');
          form.resetForm();
          this.selectedEvent = null;
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Une erreur est survenue');
        },
      });
    }
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
