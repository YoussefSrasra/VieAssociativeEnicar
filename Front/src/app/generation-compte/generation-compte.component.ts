import { Component, OnInit } from '@angular/core';
import { EntretienService } from '../entretiens/entretien.service'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private entretienService: EntretienService) {}

  ngOnInit(): void {
    this.loadEntretiensAcceptes();
  }

  loadEntretiensAcceptes(): void {
    this.entretienService.getEntretiens().subscribe({
      next: (data: any[]) => {
        this.entretiensAcceptes = data.filter(e => e.resultat === 'ACCEPTE');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des entretiens';
        this.isLoading = false;
      }
    });
  }
  genererCompte(entretien: any): void {
    console.log("Génération du compte pour :", entretien.enrollment.email);
    // Tu implémenteras la logique ici plus tard
  }
  
}
