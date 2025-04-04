import { Component } from '@angular/core';
import { DemandeClubService } from 'src/app/accueil/demande-club.service';
import { FormsModule } from '@angular/forms';
 
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-creationclub',
  imports: [RouterModule, FormsModule],
  templateUrl: './creationclub.component.html',
  styleUrls: ['./creationclub.component.scss']
})
export class CreationClubComponent {
  demande = {
    nom: '',
    prenom: '',
    email: '',
    niveau: '',
    nomClub: '',
    description: ''
  };

  constructor(private demandeClubService: DemandeClubService) {}

  soumettreDemande() {
    this.demandeClubService.envoyerDemande(this.demande).subscribe(
      response => {
        console.log('Demande envoyée avec succès !', response);
        alert('Votre demande a été envoyée avec succès.');
      },
      error => {
        console.error('Erreur lors de l’envoi de la demande', error);
        alert('Échec de l’envoi de la demande.');
      }
    );
  }
}
