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
  etat: 'ACCEPTE' | 'REJETE' | 'EN_ATTENTE';} 
@Component({
  selector: 'app-demandeclubadmin',
  imports: [RouterModule, FormsModule,CommonModule],
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

  loadDemandes(): void {
    this.loading = true;
    this.http.get<DemandeClub[]>(`${environment.apiUrl}/api/demandes`)
      .subscribe({
        next: (data) => {
          this.demandes = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load requests. Please try again later.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  deleteDemande(id: number): void {
    if (confirm('Are you sure you want to delete this request?')) {
      this.http.delete(`${environment.apiUrl}/api/demandes/${id}`)
        .subscribe({
          next: () => {
            this.demandes = this.demandes.filter(d => d.id !== id);
          },
          error: (err) => {
            console.error(err);
            alert('Failed to delete request');
          }
        });
    }
  }
  approveDemande(id: number): void {
    this.http.patch(`${environment.apiUrl}/api/demandes/${id}/approve`, {})
      .subscribe({
        next: () => {
          const index = this.demandes.findIndex(d => d.id === id);
          if (index !== -1) {
            this.demandes[index].etat = 'ACCEPTE';
          }
        },
        error: (err) => {
          console.error(err);
          alert('Échec de l\'approbation de la demande');
        }
      });
  }
  
  rejectDemande(id: number): void {
    this.http.patch(`${environment.apiUrl}/api/demandes/${id}/reject`, {})
      .subscribe({
        next: () => {
          const index = this.demandes.findIndex(d => d.id === id);
          if (index !== -1) {
            this.demandes[index].etat = 'REJETE';
          }
        },
        error: (err) => {
          console.error(err);
          alert('Échec du rejet de la demande');
        }
      });
  }
}
