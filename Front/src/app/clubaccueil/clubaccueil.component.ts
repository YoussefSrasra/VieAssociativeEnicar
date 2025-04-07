import { Component, OnInit } from '@angular/core';
import { ClubService } from './clubservice.service';
import { EnrollformService } from './enrollform.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, of, finalize } from 'rxjs';

interface Club {
  id: number;
  name: string;
  specialty: string;
  status?: string;
  logo?: string;
}

interface EnrollmentData {
  nom: string;
  prenom: string;
  email: string;
  numeroTelephone: string;
  dateNaissance: string;  // Nouveau champ
  departementEtude: string;  // Nouveau champ
  niveauEtude: string;
  messageMotivation: string;
  clubId: number | null;
}
@Component({
  selector: 'app-club-accueil',
  templateUrl: './clubaccueil.component.html',
  styleUrls: ['./clubaccueil.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClubAccueilComponent implements OnInit {
  clubs: Club[] = [];
  loading = true;
  error: string | null = null;
  showEnrollmentModal = false;
  selectedClub: Club | null = null;
  formSubmissionError: string | null = null;

  enrollmentData: EnrollmentData = {
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',  // Nouveau champ
    departementEtude:'',  
    numeroTelephone: '',
    niveauEtude: '',
    messageMotivation: '',
    clubId: null
  };

  constructor(
    private clubService: ClubService,
    private enrollService: EnrollformService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getAllClubs().pipe(
      catchError(err => {
        this.error = 'Erreur lors du chargement des clubs';
        console.error(err);
        return of([]);
      }),
      finalize(() => this.loading = false)
    ).subscribe({
      next: (data) => {
        this.clubs = data as Club[];
      }
    });
  }

  getSafeLogoUrl(logoBase64: string | undefined): SafeUrl | null {
    if (!logoBase64) return null;
    return this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64,' + logoBase64);
  }

  openEnrollmentModal(club: Club): void {
    this.selectedClub = club;
    this.enrollmentData = {
      nom: '',
      prenom: '',
      email: '',
      dateNaissance: '',  // Nouveau champ
  departementEtude: '',  
      numeroTelephone: '',
      niveauEtude: '',
      messageMotivation: '',
      clubId: club.id
    };
    this.showEnrollmentModal = true;
    this.formSubmissionError = null;
  }

  submitEnrollment(form: NgForm): void {
    if (form.valid) {
      this.enrollService.createEnrollment(this.enrollmentData).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.showEnrollmentModal = false;
          form.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'inscription:', err);
          this.formSubmissionError = 'Erreur lors de la soumission du formulaire';
        }
      });
    } else {
      this.formSubmissionError = 'Veuillez remplir tous les champs obligatoires';
    }
  }
}