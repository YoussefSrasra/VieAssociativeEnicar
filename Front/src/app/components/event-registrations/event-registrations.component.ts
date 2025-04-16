import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../../services/participant.service';
import { MailService } from '../../services/mail.service';

@Component({
  selector: 'app-event-registrations',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule,],
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.scss']
})
export class EventRegistrationsComponent implements OnInit {
  events: any[] = [];
  selectedEvent: any = null;
  searchTerm = '';
  filteredParticipants: any[] = [];
  isLoading = true;
  errorMessage: string = ''; // Ajout pour la gestion d'erreur
  participants: any[] = []; // Ajout de cette propriété
   filteredMembers: any[] = [];  // Membres uniquement
  filteredResponsibles: any[] = [];  // Responsables uniquement
  formVisible = false;
  formData = {
    nom: '',
    prenom: '',
    comite: ''
  };
  availableComites: string[] = ['Comité A', 'Comité B', 'Comité C']; // Liste de comités disponibles
  constructor(private participantService: ParticipantService , private mailService: MailService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.participantService.getEventStats().subscribe({
      next: (events) => {
        this.events = events;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Failed to load events';
        this.isLoading = false;
      }
    });
  }
  generateFormForParticipant(participant: any): void {
    if (participant.participationType === 'Responsable') {
      // Logique pour générer un formulaire pour le responsable
      console.log(`Générer le formulaire pour ${participant.nom} ${participant.prenom}`);
      // Vous pouvez ouvrir un modal ou une nouvelle page avec un formulaire
      // par exemple : this.openFormModal(participant);
    } else {
      alert('Seuls les responsables peuvent générer un formulaire');
    }
  }
  selectEvent(event: any): void {
    this.selectedEvent = event;
    this.isLoading = true;

    console.log('Event sélectionné:', event);

    this.participantService.getParticipantsByEvent(event.eventName).subscribe({
      next: (participants) => {
        console.log('Données brutes reçues:', participants);

        // Store participants and initialize filteredParticipants
        this.participants = participants;
        this.filteredParticipants = [...this.participants];

        console.log('Participants après traitement:', this.participants);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        this.isLoading = false;
      }
    });
  }

  filterParticipants(): void {
    if (!this.searchTerm) {
      this.filteredParticipants = [...this.participants];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredParticipants = this.participants.filter(p =>
      (p.nom?.toLowerCase().includes(term)) ||
      (p.email?.toLowerCase().includes(term))
      // Removed prenom filter since it's not in your database
    );
  }

  sendReminder(event: any): void {
    if (confirm(`Envoyer un rappel pour ${event.eventName} ?`)) {
      this.participantService.sendReminder(event.id).subscribe({
        next: () => {
          alert(`Rappel envoyé aux ${event.registeredCount} participants !`);
        },
        error: (err) => {
          console.error('Erreur:', err);
          alert('Erreur lors de l\'envoi des rappels');
        }
      });
    }
  }

  exportParticipants(): void {
    if (!this.selectedEvent) return;

    const csvContent = this.convertToCSV(this.selectedEvent.participants);
    this.downloadCSV(csvContent, `participants_${this.selectedEvent.eventName}.csv`);
  }

  private convertToCSV(participants: any[]): string {
    const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Date Inscription', 'Comité', 'Niveau'];
    const rows = participants.map(p =>
      [p.id, p.nom, p.prenom, p.email,
       new Date(p.createdAt).toLocaleDateString(),
       p.comite, p.niveauEtudes]
    );

    return [headers, ...rows].map(e => e.join(',')).join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
  approveParticipant(participantId: number) {
    if (confirm('Confirmez l\'approbation de ce participant ?')) {
      this.participantService.approveParticipant(participantId).subscribe({
        next: () => {
          alert('Participant approuvé avec succès');
          this.refreshParticipants();
        },
        error: (err) => {
          alert('Erreur lors de l\'approbation');
          console.error(err);
        }
      });
    }
  }

  rejectParticipant(participantId: number) {
    if (confirm("Confirmez le refus de ce participant ?")) {
      this.participantService.rejectParticipant(participantId).subscribe({
        next: () => {
          alert("Participant refusé avec succès");
          this.refreshParticipants();
        },
        error: (err) => {
          alert("Erreur lors du refus");
          console.error(err);
        }
      });
    }
  }


  private refreshParticipants() {
    if (this.selectedEvent) {
      this.selectEvent(this.selectedEvent);
    }
  }

  generateFormForResponsible(participant: any): void {
    if (participant.participationType === 'Responsable') {
      this.formVisible = true;
      this.formData.nom = participant.nom;
      this.formData.prenom = participant.prenom;
    }
  }
  submitForm(): void {
    const formDetails = {
      ...this.formData,
      email: 'email@responsable.com' // L'email doit être pris dynamiquement

  }
}
}
