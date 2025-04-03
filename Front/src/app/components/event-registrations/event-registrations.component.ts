import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { FormsModule } from '@angular/forms';

interface Event {
  id: number;
  name: string;
  registeredCount: number;
  waitingListCount: number;
  participants: Participant[];
}

interface Participant {
  id: number;
  name: string;
  email: string;
  registrationDate: Date;
  status: 'confirmed' | 'waiting';
}

@Component({
  selector: 'app-event-registrations',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule],
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.scss']
})
export class EventRegistrationsComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | null = null;
  searchTerm = '';
  filteredParticipants: Participant[] = [];

  ngOnInit(): void {
    // Simuler des données (remplacer par un appel API)
    this.events = [
      {
        id: 1,
        name: 'Soirée Gala',
        registeredCount: 50,
        waitingListCount: 5,
        participants: this.generateParticipants(50, 5)
      },
      {
        id: 2,
        name: 'Conférence Tech',
        registeredCount: 30,
        waitingListCount: 2,
        participants: this.generateParticipants(30, 2)
      }
    ];
  }

  private generateParticipants(registered: number, waiting: number): Participant[] {
    const participants: Participant[] = [];

    // Inscrits confirmés
    for (let i = 1; i <= registered; i++) {
      participants.push({
        id: i,
        name: `Participant ${i}`,
        email: `participant${i}@example.com`,
        registrationDate: new Date(),
        status: 'confirmed'
      });
    }

    // Liste d'attente
    for (let i = 1; i <= waiting; i++) {
      participants.push({
        id: registered + i,
        name: `En attente ${i}`,
        email: `waiting${i}@example.com`,
        registrationDate: new Date(),
        status: 'waiting'
      });
    }

    return participants;
  }

  selectEvent(event: Event): void {
    this.selectedEvent = event;
    this.filterParticipants();
  }

  filterParticipants(): void {
    if (!this.selectedEvent) return;

    this.filteredParticipants = this.selectedEvent.participants.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sendReminder(event: Event): void {
    if (confirm(`Envoyer un rappel pour ${event.name} ?`)) {
      // Implémenter la logique d'envoi
      console.log(`Rappel envoyé pour ${event.name}`);
      alert(`Rappel envoyé aux ${event.registeredCount} participants !`);
    }
  }

  exportParticipants(): void {
    if (!this.selectedEvent) return;

    // Implémenter l'export CSV
    const csvContent = this.convertToCSV(this.selectedEvent.participants);
    this.downloadCSV(csvContent, `participants_${this.selectedEvent.name}.csv`);
  }

  private convertToCSV(participants: Participant[]): string {
    const headers = ['ID', 'Nom', 'Email', 'Date Inscription', 'Statut'];
    const rows = participants.map(p =>
      [p.id, p.name, p.email, p.registrationDate.toLocaleDateString(), p.status === 'confirmed' ? 'Confirmé' : 'En attente']
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
}
