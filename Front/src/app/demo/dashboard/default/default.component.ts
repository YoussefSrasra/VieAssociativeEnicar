import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { RiseOutline, FallOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ParticipantService } from 'src/app/services/participant.service';
import { DemandeClubService } from 'src/app/accueil/demande-club.service';
import { ClubRequestService } from 'src/app/services/club-request.service';

@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    IconDirective
  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent {
  private iconService = inject(IconService);
  private participantService = inject(ParticipantService);
  private demandeClubService = inject(DemandeClubService);
  private clubRequestService = inject(ClubRequestService);

  eventStats: any = {};
  clubStats: any = {};
  loading = true;

  constructor() {
    this.iconService.addIcon(...[RiseOutline, FallOutline]);
    this.loadStats();
  }

  loadStats() {
    this.loading = true;

    // Charger les stats des événements
    this.participantService.getEventStats().subscribe({
      next: (events) => {
        this.eventStats = {
          totalEvents: events.length,
          totalParticipants: events.reduce((acc, event) => acc + event.registeredCount, 0),
          pendingApprovals: events.reduce((acc, event) => acc + (event.waitingListCount || 0), 0)
        };

        // Charger les stats des clubs
        this.loadClubStats();
      },
      error: (err) => {
        console.error('Error loading event stats:', err);
        this.loadClubStats();
      }
    });
  }

  loadClubStats() {
    this.demandeClubService.getDemandes().subscribe({
      next: (demandes) => {
        this.clubStats = {
          totalClubs: demandes.filter(d => d.etat === 'ACCEPTE').length,
          pendingRequests: demandes.filter(d => d.etat === 'EN_ATTENTE').length,
          rejectedRequests: demandes.filter(d => d.etat === 'REJETE').length
        };

        // Charger les stats des demandes d'événements
        this.loadEventRequestStats();
      },
      error: (err) => {
        console.error('Error loading club stats:', err);
        this.loadEventRequestStats();
      }
    });
  }

  loadEventRequestStats() {
    this.clubRequestService.getAllRequests().subscribe({
      next: (requests) => {
        this.eventStats.totalRequests = requests.length;
        this.eventStats.approvedRequests = requests.filter(r => r.status === 'APPROVED').length;
        this.eventStats.pendingRequests = requests.filter(r => r.status === 'PENDING').length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event request stats:', err);
        this.loading = false;
      }
    });
  }

  AnalyticEcommerce = [
    {
      title: 'Événements Actifs',
      amount: '0',
      background: 'bg-light-primary',
      border: 'border-primary',
      icon: 'rise',
      percentage: '0%',
      color: 'text-primary',
      number: '0'
    },
    {
      title: 'Participants Totaux',
      amount: '0',
      background: 'bg-light-primary',
      border: 'border-primary',
      icon: 'rise',
      percentage: '0%',
      color: 'text-primary',
      number: '0'
    },
    {
      title: 'Demandes en Attente',
      amount: '0',
      background: 'bg-light-warning',
      border: 'border-warning',
      icon: 'fall',
      percentage: '0%',
      color: 'text-warning',
      number: '0'
    },
    {
      title: 'Clubs Actifs',
      amount: '0',
      background: 'bg-light-success',
      border: 'border-success',
      icon: 'rise',
      percentage: '0%',
      color: 'text-success',
      number: '0'
    }
  ];
}
