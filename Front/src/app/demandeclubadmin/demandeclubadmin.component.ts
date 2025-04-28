import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

interface DemandeClub {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  nomClub: string;
  description: string;
  logoBase64: string; // Champ pour stocker l'image en base64
  etat: 'ACCEPTE' | 'REJETE' | 'EN_ATTENTE';
}

@Component({
  selector: 'app-demandeclubadmin',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './demandeclubadmin.component.html',
  styleUrl: './demandeclubadmin.component.scss'
})
export class DemandeclubadminComponent implements OnInit {
  demandes: DemandeClub[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadDemandes();
  }

  getEtatText(etat: string): string {
    const etats = {
      'EN_ATTENTE': 'En attente',
      'ACCEPTE': 'Approuvé',
      'REJETE': 'Rejeté'
    };
    return etats[etat] || etat;
  }

  loadDemandes(): void {
    this.loading = true;
    this.http.get<DemandeClub[]>(`${environment.apiUrl}/api/demandes`)
      .subscribe({
        next: (data) => {
          this.demandes = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Échec du chargement des demandes. Veuillez réessayer plus tard.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  approveDemande(id: number): void {
    this.http.put<DemandeClub>(`${environment.apiUrl}/api/demandes/${id}/approve`, {})
      .subscribe({
        next: (updatedDemande) => {
          this.demandes = this.demandes.map(d => 
            d.id === id ? updatedDemande : d
          );
        },
        error: (err) => {
          console.error(err);
          alert('Échec de l\'approbation de la demande');
        }
      });
  }

  rejectDemande(id: number): void {
    this.http.put<DemandeClub>(`${environment.apiUrl}/api/demandes/${id}/reject`, {})
      .subscribe({
        next: (updatedDemande) => {
          this.demandes = this.demandes.map(d => 
            d.id === id ? updatedDemande : d
          );
        },
        error: (err) => {
          console.error(err);
          alert('Échec du rejet de la demande');
        }
      });
  }

  deleteDemande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.http.delete(`${environment.apiUrl}/api/demandes/${id}`)
        .subscribe({
          next: () => {
            this.demandes = this.demandes.filter(d => d.id !== id);
          },
          error: (err) => {
            console.error(err);
            alert('Échec de la suppression de la demande');
          }
        });
    }
  }

  creerClub(demande: DemandeClub): void {
    if (confirm(`Créer le club "${demande.nomClub}" ?`)) {
      this.http.post(`${environment.apiUrl}/api/demandes/creer/${demande.id}`, {})
        .subscribe({
          next: () => {
            alert('Club créé avec succès');
            // Optionnel : recharger la liste des demandes
            this.loadDemandes();
          },
          error: (err) => {
            console.error(err);
            alert('Échec de la création du club');
          }
        });
    }
  }
  

  // Version modifiée de genererCompte pour accepter un callback
  genererCompte(demande: DemandeClub, callback?: () => void): void {
    this.http.post(`${environment.apiUrl}/api/comptes/generer`, {
      email: demande.email,
      nom: demande.nom,
      prenom: demande.prenom,
      club: demande.nomClub
    }).subscribe({
      next: () => {
        alert('Compte généré avec succès');
        if (callback) callback();
      },
      error: (err) => {
        console.error(err);
        alert('Échec de la génération du compte');
      }
    });
  }
}