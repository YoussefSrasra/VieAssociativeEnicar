import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';
import { ClubRequestService } from 'src/app/services/club-request.service';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ajouté pour les filtres avec ngModel

interface EventRequest {
  id?: number;
  eventName: string;
  type: string;
  description: string;
  location: string;
  startDate: string; // ou Date si votre backend gère les objets Date
  endDate: string;   // ou Date
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

interface EventRequestDTO{
  id : number,
  nom: string;
  type: string;
  description: string;
  location: string;
  startDate: string; // ou Date si votre backend gère les objets Date
  endDate: string;
  clubName: string

}

@Component({
  selector: 'app-club-events',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule], // Ajout de FormsModule
  templateUrl: './club-events.component.html',
  styleUrls: ['./club-events.component.scss']
})
export class ClubEventsComponent implements OnInit {
  clubId!: number;
  events: EventRequestDTO[] = [];
  filteredEvents: EventRequestDTO[] = [];
  isLoading = false;
  searchTerm = '';
  selectedStatus = 'all';

  constructor(
    private route: ActivatedRoute,
    private requestService: ClubRequestService ,
    private router: Router
  ) {}
  showOnlyMyParticipations = false; // Nouvelle variable pour le filtre
  myParticipations: number[] = []; // Stocke les IDs des événements où l'utilisateur participe
  ngOnInit(): void {
    this.clubId = +this.route.snapshot.paramMap.get('id')!;
   // this.clubId = +localStorage.getItem("selectedClubId");
    console.log('Club ID from URL:', this.clubId);
    this.loadEvents();
    const storedParticipations = localStorage.getItem('myParticipations');
    this.myParticipations = storedParticipations ? JSON.parse(storedParticipations) : [];
    this.loadEvents();
    this.route.params.subscribe(params => {
      const newClubId = +params['id'];
      if (newClubId !== this.clubId) {
        this.clubId = newClubId;
        this.loadEvents();
      }
    });


  }

  participateInEvent(eventId: number): void {
    if (this.myParticipations.includes(eventId)) {
      alert('Vous êtes déjà inscrit à cet événement.');
      return;
    }
    this.myParticipations.push(eventId);
    localStorage.setItem('myParticipations', JSON.stringify(this.myParticipations));
    alert('Inscription enregistrée avec succès !');
  }

  formatDate(dateString: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(dateString, 'dd/MM/yyyy HH:mm') || '';
  }




  avigateToMyEvents(): void {
    this.router.navigate(['/my-events']);
  }
  loadEvents(): void {
    console.log('Loading events for club ID:', this.clubId);
    this.isLoading = true;
    this.requestService.getAcceptedEventsByClub(this.clubId).subscribe({
      next: (events) => {
        console.log('Raw events data:', events);
        this.events = events;
        this.filteredEvents = [...events];
        this.isLoading = false;
       // this.filterEvents();
      },
      error: (err) => {
        console.error('Full error:', err);
        console.log('Error status:', err.status);
        console.log('Error message:', err.message);
        this.isLoading = false;
      }
    });
  }

 /* filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = event.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          (event.clubName.toLowerCase().includes(this.searchTerm.toLowerCase()) || false);
      const matchesStatus = this.selectedStatus === 'all' || event.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }*/

  getStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'APPROVED':
        return 'Approuvé';
      case 'REJECTED':
        return 'Rejeté';
      default:
        return status || 'N/A';
    }
  }



}
