import { Component, OnInit } from '@angular/core';
import { ClubService } from '../clubaccueil/clubservice.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-detail-club',
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-club.component.html',
  styleUrl: './detail-club.component.scss'
})
export class DetailClubComponent implements OnInit {
  successMessage = '';
errorMessage = '';


  isLoading = true;
  userClub: any = null;
constructor(

    private clubService: ClubService
  ) { }
  ngOnInit(): void {
    this.loadUserData();
  }

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
      this.isLoading = false;
       // Ajoutez cette ligne
    } else {
      this.handleError('Aucun club trouvé pour cet utilisateur');
    }
  }
 
  isEditing = false;

toggleEdit(): void {
  this.isEditing = true;
}

saveChanges(): void {
  this.clubService.updateClub(this.userClub.id, this.userClub).subscribe({
    next: () => {
      this.successMessage = 'Modifications enregistrées avec succès.';
      this.errorMessage = '';
      this.isEditing = false;
    },
    error: (err) => {
      this.successMessage = '';
      this.errorMessage = 'Une erreur est survenue lors de la sauvegarde.';
    }
  });
}

private handleError(message: string, error?: any): void {
  this.errorMessage = message;
  this.successMessage = '';
  this.isLoading = false;
}

onLogoSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userClub.logo = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

}


export interface Club {
  name: string;
  specialty: string;
  logo?: string; // Champ optionnel
  mandatStart: string; // Par exemple : '2023-09-01'
  mandatduree: string; // Optionnel, si le mandat est toujours en cours
  
}
