import { Component, OnInit } from '@angular/core';
import { EntretienService } from '../entretiens/entretien.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClubService } from '../clubaccueil/clubservice.service';

@Component({
  selector: 'app-generation-compte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generation-compte.component.html',
  styleUrls: ['./generation-compte.component.scss']
})
export class GenerationCompteComponent implements OnInit {

  entretiensAcceptes: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  clubNames: { [key: string]: string } = {};

  constructor(private entretienService: EntretienService,
              private clubService: ClubService) {}

  ngOnInit(): void {
    this.loadEntretiensAcceptes();
  }

  loadEntretiensAcceptes(): void {
    this.entretienService.getEntretiens().subscribe({
      next: (data: any[]) => {
        const acceptes = data
          .filter(e => e.resultat === 'ACCEPTE' && e.statut !== 'COMPTE')
          .map(e => ({ ...e, compteCree: false }));
    
        this.entretiensAcceptes = acceptes;
    
        // Récupération des noms des clubs en utilisant l'API pour obtenir l'ID du club
        acceptes.forEach(entretien => {
          this.entretienService.getClubIdByEntretienId(entretien.id).subscribe({
            next: (clubId) => {
              // Maintenant, récupère le nom du club via le service ClubService
              this.clubService.getClubById(clubId).subscribe({
                next: (club) => this.clubNames[entretien.id] = club.name,
                error: (err) => console.error(`Erreur chargement club ${clubId}:`, err)
              });
            },
            error: (err) => console.error(`Erreur récupération ID club pour entretien ${entretien.id}:`, err)
          });
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des entretiens';
        this.isLoading = false;
        setTimeout(() => this.errorMessage = null, 4000);
      }
    });
  }

  genererCompte(entretien: any): void {
    this.entretienService.creercompte(entretien.id).subscribe({
      next: () => {
        entretien.statut = 'COMPTE';
        this.entretienService.updateEntretien(entretien.id, entretien).subscribe({
          next: () => {
            this.successMessage = 'Compte créé et statut mis à jour avec succès';
            this.entretiensAcceptes = this.entretiensAcceptes.filter(e => e.id !== entretien.id);
            setTimeout(() => this.successMessage = null, 4000);
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du statut :', err);
            this.errorMessage = 'Le compte a été créé mais la mise à jour du statut a échoué';
            setTimeout(() => this.errorMessage = null, 4000);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte :', err);
        this.errorMessage = 'Erreur lors de la création du compte';
        setTimeout(() => this.errorMessage = null, 4000);
      }
    });
  }
  genererTousLesComptes() {
    this.entretiensAcceptes.forEach(entretien => {
      if (!entretien.compteCree) {
        this.genererCompte(entretien);
      }
    });
  }
  
}
