import { Component, OnInit } from '@angular/core';
import { EntretienService } from './entretien.service';
import { ClubService } from '../clubaccueil/clubservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entretiens',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule],
  templateUrl: './entretiens.component.html',
  styleUrls: ['./entretiens.component.scss']
})
export class EntretiensComponent implements OnInit {
  entretiens: any[] = [];
  selectedEnrollment: any = null;
  showModal = false;
  clubId: number | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private entretienService: EntretienService,
    private clubService: ClubService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadClubAndEntretiens();
  }

  loadClubAndEntretiens(): void {
    this.errorMessage = null;
    this.successMessage = null;

    const clubName = localStorage.getItem('username');
    
    if (!clubName) {
      this.errorMessage = 'Aucun club sélectionné';
      this.isLoading = false;
      return;
    }

    this.clubService.getClubByUsername(clubName).subscribe({
      next: (club: any) => {
        this.clubId = club.id;
        this.loadEntretiensByClub(this.clubId!);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement du club';
        this.isLoading = false;
      }
    });
  }

  loadEntretiensByClub(clubId: number): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.entretienService.getEntretiensByClub(clubId).subscribe({
      next: (data: any[]) => {
        this.entretiens = data.filter(entretien => entretien.resultat === "EN_ATTENTE");
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des entretiens';
        this.isLoading = false;
      }
    });
  }

  showEnrollmentDetails(enrollmentId: number): void {
    this.errorMessage = null;

    this.entretienService.getEnrollmentDetails(enrollmentId).subscribe({
      next: (data: any) => {
        this.selectedEnrollment = data;
        this.showModal = true;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des détails';
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedEnrollment = null;
  }

  saveEntretien(entretien: any): void {
    if (!entretien.id) return;

    this.errorMessage = null;
    this.successMessage = null;

    this.entretienService.updateEntretien(entretien.id, entretien).subscribe({
      next: () => {
        this.successMessage = 'Modifications sauvegardées avec succès !';
        if (this.clubId) {
          this.loadEntretiensByClub(this.clubId);
        }
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors de la sauvegarde';
      }
    });
  }

  changeStatus(entretien: any, newStatus: string): void {
    entretien.statut = newStatus;
    this.saveEntretien(entretien);
  }

  changeResult(entretien: any, newResult: string): void {
    entretien.resultat = newResult;
    this.saveEntretien(entretien);
  }
}
