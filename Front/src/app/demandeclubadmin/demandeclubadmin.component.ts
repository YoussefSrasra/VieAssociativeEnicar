import { Component, OnInit } from '@angular/core';
import { DemandeClub, DemandeClubService } from 'src/app/accueil/demande-club.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-demandeclubadmin',
  templateUrl: './demandeclubadmin.component.html',
  imports: [RouterModule, FormsModule, CommonModule],
  styleUrl: './demandeclubadmin.component.scss'
})
export class DemandeclubadminComponent implements OnInit {
  demandes: DemandeClub[] = [];
  loading = true;
  error = '';

  constructor(private demandeService: DemandeClubService) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  getEtatText(etat: string): string {
    return {
      'EN_ATTENTE': 'En attente',
      'ACCEPTE': 'Approuvé',
      'REJETE': 'Rejeté'
    }[etat] || etat;
  }

  loadDemandes(): void {
    this.loading = true;
    this.demandeService.getDemandes().subscribe({
      next: (data) => {
        this.demandes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur de chargement.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  approveDemande(demande: DemandeClub): void {
    this.demandeService.creerClub(demande.id).subscribe({
      next: () => {
        alert('Club créé');
        this.loadDemandes();
      },
      error: () => alert('Erreur création club')
    });
  }

  rejectDemande(id: number): void {
    this.demandeService.rejectDemande(id).subscribe({
      next: (updated) => {
        this.demandes = this.demandes.map(d => d.id === id ? updated : d);
      },
      error: (err) => alert('Erreur rejet')
    });
  }

  deleteDemande(id: number): void {
    if (confirm('Confirmer suppression ?')) {
      this.demandeService.deleteDemande(id).subscribe({
        next: () => {
          this.demandes = this.demandes.filter(d => d.id !== id);
        },
        error: (err) => alert('Erreur suppression')
      });
    }
  }

  
 /* genererCompte(demande: DemandeClub, callback?: () => void): void {
    this.demandeService.genererCompte({
      email: demande.email,
      nom: demande.nom,
      prenom: demande.prenom,
      club: demande.nomClub
    }).subscribe({
      next: () => {
        alert('Compte généré');
        callback?.();
      },
      error: () => alert('Erreur génération compte')
    });
  }*/
}
