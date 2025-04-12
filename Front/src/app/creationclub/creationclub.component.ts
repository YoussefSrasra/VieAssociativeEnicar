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
    description: '',
    logoBase64: '' // Nouveau champ pour stocker l'image en base64
  };

  constructor(private demandeClubService: DemandeClubService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Lorsque la lecture est terminée, stocker le résultat en base64
        this.demande.logoBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  soumettreDemande() {
    // Vérifier si un logo a été uploadé (optionnel)
    if (!this.demande.logoBase64) {
      if (!confirm("Aucun logo n'a été sélectionné. Voulez-vous tout de même soumettre la demande ?")) {
        return;
      }
    }

    this.demandeClubService.envoyerDemande(this.demande).subscribe(
      response => {
        console.log('Demande envoyée avec succès !', response);
        alert('Votre demande a été envoyée avec succès.');
      },
      error => {
        console.error('Erreur lors de envoi de la demande', error);
        alert('Échec de envoi de la demande.');
      }
    );
  }
}