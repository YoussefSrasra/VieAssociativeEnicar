import { Component } from '@angular/core';
import { DemandeClubService } from 'src/app/accueil/demande-club.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creationclub',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './creationclub.component.html',
  styleUrls: ['./creationclub.component.scss']
})
export class CreationClubComponent {
  emailError = false;
emailErrorMessage = '';
  showError = false;
errorMessage = '';
showSuccess = false;
successMessage = '';
  demande = {
    nom: '',
    prenom: '',
    email: '',
    niveau: '',
    nomClub: '',
    description: '',
    logoBase64: '' 
  };

  constructor(private demandeClubService: DemandeClubService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    if (file) {
      // Vérification de la taille (1MB max)
      if (file.size > 1048576) {
        alert('Le fichier est trop volumineux (max 1MB)');
        return;
      }
      
      // Vérification du type (image seulement)
      if (!file.type.match(/image\/*/)) {
        alert('Seules les images sont acceptées');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        // Le résultat est une string base64
        this.demande.logoBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  soumettreDemande() {
    // Réinitialiser les messages
    this.showError = false;
    this.showSuccess = false;
    this.emailError = false;

    // Validation de l'email
    this.validateEmail(); // Cette méthode met à jour emailError et emailErrorMessage
    
    // Si email invalide, ne pas soumettre
    if (this.emailError) {
        return;
    }

    // Vérification des champs obligatoires
    if (!this.demande.nom || !this.demande.prenom || !this.demande.niveau || !this.demande.nomClub || !this.demande.description) {
        this.showError = true;
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
        return;
    }

    // Vérification optionnelle du logo
    if (!this.demande.logoBase64) {
        if (!confirm("Aucun logo n'a été sélectionné. Voulez-vous tout de même soumettre la demande ?")) {
            return;
        }
    }

    // Envoi de la demande
    this.demandeClubService.envoyerDemande(this.demande).subscribe(
        (response) => {
            this.showSuccess = true;
            this.successMessage = 'Votre demande a été envoyée avec succès !';
            
            // Réinitialiser le formulaire après succès
            this.demande = {
                nom: '',
                prenom: '',
                email: '',
                niveau: '',
                nomClub: '',
                description: '',
                logoBase64: ''
            };
            
            // Masquer le message après 5 secondes
            setTimeout(() => {
                this.showSuccess = false;
            }, 5000);
        },
        (error) => {
            this.showError = true;
            this.errorMessage = error.error?.message || 'Échec de l\'envoi de la demande. Veuillez réessayer.';
        }
    );
}
validateEmail() {
  if (!this.demande.email) {
      this.emailError = true;
      this.emailErrorMessage = 'Veuillez fournir une adresse email';
      return;
  }
  
  if (!this.isValidEnicarEmail(this.demande.email)) {
      this.emailError = true;
      this.emailErrorMessage = 'L\'email doit être de la forme nom.prenom@enicar.ucar.tn';
  } else {
      this.emailError = false;
  }
}

isValidEnicarEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9._-]+@enicar\.ucar\.tn$/;
  return pattern.test(email);
}


}