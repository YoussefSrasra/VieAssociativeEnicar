import { Component } from '@angular/core';
import { DemandeClubService } from 'src/app/accueil/demande-club.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creationclub',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './creationclub.component.html',
  styleUrls: ['./creationclub.component.scss']
})
export class CreationClubComponent {
  formSubmitted = false;
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
      if (file.size > 7*1024*1024) {
        this.showError = true;
        this.errorMessage = 'Le fichier est trop volumineux (max 1MB)';
        return;
      }
      
      // Vérification du type (image seulement)
      if (!file.type.match(/image\/*/)) {
        this.showError = true;
        this.errorMessage = 'Seules les images sont acceptées';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.demande.logoBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  soumettreDemande() {
    this.formSubmitted = true;
    this.showError = false;
    this.showSuccess = false;

    // Validation de l'email
    if (!this.isValidEnicarEmail(this.demande.email)) {
      this.showError = true;
      this.errorMessage = 'L\'email doit être de la forme nom.prenom@enicar.ucar.tn';
      this.scrollToInvalidField('email');
      return;
    }

    // Vérification des champs obligatoires
    if (!this.demande.nom || !this.demande.prenom || !this.demande.niveau || 
        !this.demande.nomClub || !this.demande.description) {
      this.showError = true;
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      this.scrollToFirstInvalidField();
      return;
    }

    // Envoi de la demande
    this.demandeClubService.envoyerDemande(this.demande).subscribe({
      next: (response) => {
        this.showSuccess = true;
        this.successMessage = 'Votre demande a été envoyée avec succès !';
        this.resetForm();
        
        setTimeout(() => {
          this.showSuccess = false;
        }, 5000);
      },
      error: (error) => {
        this.showError = true;
        this.errorMessage = error.error?.message || 'Échec de l\'envoi de la demande. Veuillez réessayer.';
      }
    });
  }

  private isValidEnicarEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9._-]+@enicar\.ucar\.tn$/;
    return pattern.test(email);
  }

  private scrollToFirstInvalidField(): void {
    const invalidControl = document.querySelector('.ng-invalid');
    if (invalidControl) {
      invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (invalidControl as HTMLElement).focus();
    }
  }

  private scrollToInvalidField(fieldName: string): void {
    const element = document.getElementById(fieldName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  }

  private resetForm(): void {
    this.demande = {
      nom: '',
      prenom: '',
      email: '',
      niveau: '',
      nomClub: '',
      description: '',
      logoBase64: ''
    };
    this.formSubmitted = false;
  }
}