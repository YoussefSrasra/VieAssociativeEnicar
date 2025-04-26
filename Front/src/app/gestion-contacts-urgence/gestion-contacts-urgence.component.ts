import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/components/card/card.component';
import { EmergencyService } from '../services/emergency.service';
import { FormsModule } from '@angular/forms';  // Importez FormsModule

@Component({
  selector: 'app-gestion-contacts-urgence',
  imports: [CommonModule, CardComponent,FormsModule],
  templateUrl: './gestion-contacts-urgence.component.html',
  styleUrl: './gestion-contacts-urgence.component.scss'
})
export class GestionContactsUrgenceComponent implements OnInit {
  emergencyContacts: any[] = [];
  filteredContacts: any[] = [];
  searchTerm: string = '';

  constructor(private emergencyService: EmergencyService) {}

  ngOnInit() {
    this.loadEmergencyContacts(); // Ajoutez cette ligne
    const element = document.querySelector('.some-class');
    if (element) {
      element.classList.add('another-class');
    }
  }

  loadEmergencyContacts(): void {
    this.emergencyService.getEmergencyContacts().subscribe({
      next: (contacts) => {
        this.emergencyContacts = contacts;
        this.filteredContacts = [...contacts];
      },
      error: (err) => console.error('Erreur récupération des contacts', err)
    });
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredContacts = [...this.emergencyContacts];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.emergencyContacts.filter(contact =>
      contact.username.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.clubName.toLowerCase().includes(term)
    ); // Ajout de la parenthèse fermante ici
  }


  viewDetails(manager: any): void {
    // Implémentez la navigation vers les détails
    console.log('Détails du manager:', manager);
  }

  deleteContact(manager: any): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le contact ${manager.username}?`)) {
      // Implémentez la suppression
      console.log('Suppression du manager:', manager);
    }
  }
}
