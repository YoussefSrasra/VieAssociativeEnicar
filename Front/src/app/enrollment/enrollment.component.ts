import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from './enrollment.service';
import { ClubService } from '../clubaccueil/clubservice.service';
import { Enrollment } from './enrollment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})



export class EnrollmentComponent implements OnInit {
  // Variables d'état
  enrollments: Enrollment[] = [];
  userClub: any = null;
  isLoading = true;
  errorMessage = '';
  selectedMotivation = '';
  showMotivationModal = false;

  constructor(
    private enrollmentService: EnrollmentService,
    private clubService: ClubService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  // Charge les données de l'utilisateur et son club
  private loadUserData(): void {
    const username = this.getUsernameFromStorage();
    if (!username) {
      this.handleError('Utilisateur non identifié');
      return;
    }

    this.loadUserClub(username);
  }

  // Récupère le username depuis le localStorage
  private getUsernameFromStorage(): string | null {
    return localStorage.getItem('username');
  }

  // Charge le club de l'utilisateur
  private loadUserClub(username: string): void {
    this.clubService.getClubByUsername(username).subscribe({
      next: (clubs: any) => {this.handleClubSuccess(clubs);
         console.log("aaaaaaa "+clubs)},
      error: (err) => this.handleError('Erreur lors du chargement du club', err)
    });
  }

  // Gère la réussite du chargement du club
  private handleClubSuccess(clubs: any): void {
    if (clubs) {
      this.userClub = clubs;
      this.loadEnrollments(); // Ajoutez cette ligne
    } else {
      this.handleError('Aucun club trouvé pour cet utilisateur');
    }
  }

  // Charge les inscriptions en attente
  private loadEnrollments(): void {
    this.isLoading = true;
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data: Enrollment[]) => this.handleEnrollmentsSuccess(data),
      error: (err) => this.handleError('Erreur lors du chargement des inscriptions', err)
    });
  }




  // Gère la réussite du chargement des inscriptions
  private handleEnrollmentsSuccess(data: Enrollment[]): void {
    console.log('Toutes les demandes:', data);
    console.log('Club utilisateur:', this.userClub);

    this.enrollments = data.filter(demande => {
      const match = demande.etat === 'EN_ATTENTE' &&
                   demande.clubId === this.userClub?.id;
      console.log(`Demande ${demande.id}:`, {etat: demande.etat, clubId: demande.club?.id, match});
      return match;
    });

    console.log('Demandes filtrées:', this.enrollments);
    this.isLoading = false;
  }
  // Bascule l'état des inscriptions
  toggleEnrollment(): void {
    if (!this.userClub) return;

    console.log('Club ID:', this.userClub.id);

    this.clubService.toggleEnrollmentStatus(this.userClub.id).subscribe({
      next: (res: string) => {
        console.log('Réponse brute :', res);
        // On inverse localement
      },
      error: (err) => this.handleError('Échec de la mise à jour du statut', err)
    });
  }











  // Affiche la motivation
  showMotivation(motivation: string): void {
    this.selectedMotivation = motivation;
    this.showMotivationModal = true;
  }

  // Ferme le modal de motivation
  closeMotivation(): void {
    this.showMotivationModal = false;
  }

  // Approuve une inscription
  approveEnrollment(id: number): void {
    this.enrollmentService.approveEnrollment(id).subscribe({
      next: () => this.loadEnrollments(),
      error: (err) => this.handleError('Échec de l\'approbation', err)
    });
  }

  // Rejette une inscription
  rejectEnrollment(id: number): void {
    this.enrollmentService.rejectEnrollment(id).subscribe({
      next: () => this.loadEnrollments(),
      error: (err) => this.handleError('Échec du rejet', err)
    });
  }

  // Gère les erreurs
  private handleError(message: string, error?: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    if (error) {
      console.error(error);
    }
  }
}
