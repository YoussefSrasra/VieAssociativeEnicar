import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/components/card/card.component';
import { EmergencyService } from '../services/emergency.service';

@Component({
  selector: 'app-gestion-contacts-urgence',
  imports: [CommonModule, CardComponent],
    templateUrl: './gestion-contacts-urgence.component.html',
  styleUrl: './gestion-contacts-urgence.component.scss'
})
export class GestionContactsUrgenceComponent {
  emergencyContacts: any[] = [];

  constructor(private emergencyService: EmergencyService) {}

  ngOnInit(): void {
    this.emergencyService.getEmergencyContacts().subscribe({
      next: (contacts) => this.emergencyContacts = contacts,
      error: (err) => console.error('Erreur récupération des contacts', err)
    });
  }
}
