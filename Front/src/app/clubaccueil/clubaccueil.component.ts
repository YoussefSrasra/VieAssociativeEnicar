import { Component, OnInit } from '@angular/core';
import { ClubService } from './clubservice.service';
import { EnrollformService } from './enrollform.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, of, finalize } from 'rxjs';

import { FormControl, Validators } from '@angular/forms';

import { ClubStatus} from './ClubStatus';


interface Club {
  id: number;
  name: string;
  specialty: string;
  description?: string;
  status: string;
  logo?: string;
  creationDate?: Date;
  membersCount?: number;
  enrollmentOpen: boolean;
}

interface EnrollmentData {
  nom: string;
  prenom: string;
  email: string;
  numeroTelephone: string;
  dateNaissance: string;
  departementEtude: string;
  niveauEtude: string;
  messageMotivation: string;
  clubId: number | null;
}

@Component({
  selector: 'app-club-accueil',
  templateUrl: './clubaccueil.component.html',
  styleUrls: ['./clubaccueil.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule ]
})
export class ClubAccueilComponent implements OnInit {
  formSubmitted = false;
  showSuccessMessage = false;
  successMessage = '';

  clubs: Club[] = [];
  filteredClubs: Club[] = [];
  loading = true;
  error: string | null = null;
  showEnrollmentModal = false;
  selectedClub: Club | null = null;
  formSubmissionError: string | null = null;
  searchTerm = '';
  currentSort = 'name';
  sortDirection = 'asc';

  enrollmentData: EnrollmentData = {
    nom: '',
    prenom: '',
    email: '',
    dateNaissance: '',
    departementEtude: '',
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
    this.loading = true;
    this.error = null;
    
    this.clubService.getAllClubs().pipe(
      catchError(err => {
        this.error = 'Erreur lors du chargement des clubs. Veuillez réessayer plus tard.';
        console.error('Erreur:', err);
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
        this.filterAndSortClubs();
      })
    ).subscribe({
      next: (data) => {
        this.clubs = data as Club[];
      }
    });
  }

  filterAndSortClubs(): void {
    // Filtrage initial par statut "active"
    let filtered = this.clubs.filter(club => club.status === ClubStatus.ACTIVE);

    // Filtrage par recherche si terme saisi
    if (this.searchTerm) {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (club.specialty && club.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      const valA = a[this.currentSort as keyof Club];
      const valB = b[this.currentSort as keyof Club];

      if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else if (valA instanceof Date && valB instanceof Date) {
        comparison = valA.getTime() - valB.getTime();
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredClubs = filtered;
  }

  onSearchChange(): void {
    this.filterAndSortClubs();
  }

  sortClubs(sortKey: string): void {
    if (this.currentSort === sortKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = sortKey;
      this.sortDirection = 'asc';
    }
    this.filterAndSortClubs();
  }

  openEnrollmentModal(club: Club): void {
    if (!club.enrollmentOpen)  {
      this.formSubmissionError = 'Les inscriptions pour ce club ne sont pas ouvertes pour le moment.';
      return;
    }
    
    this.selectedClub = club;
    this.enrollmentData = {
      nom: '',
      prenom: '',
      email: '',
      dateNaissance: '',
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
    this.formSubmitted = true;
    
    if (form.invalid) {
      this.scrollToFirstInvalidControl(form);
      return;
    }
  
    if (!this.isValidEnicarEmail(this.enrollmentData.email)) {
      this.formSubmissionError = 'L\'email doit être de la forme nom.prenom@enicar.ucar.tn';
      this.scrollToControl('email');
      return;
    }
  
    this.enrollService.createEnrollment(this.enrollmentData).subscribe({
      next: (response) => {
        console.log('Inscription réussie:', response);
        this.showSuccessMessage = true;
        this.successMessage = 'Candidature envoyée avec succès!';
        setTimeout(() => {
          this.showSuccessMessage = false;
          this.showEnrollmentModal = false;
          this.formSubmitted = false;
          form.resetForm();
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription:', err);
        this.formSubmissionError = err.error?.message || 'Erreur lors de la soumission du formulaire. Veuillez réessayer.';
      }
    });
  }
  
  private scrollToFirstInvalidControl(form: NgForm): void {
    for (const key of Object.keys(form.controls)) {
      if (form.controls[key].invalid) {
        this.scrollToControl(key);
        break;
      }
    }
  }
  
  private scrollToControl(controlName: string): void {
    const controlElement = document.getElementById(controlName);
    if (controlElement) {
      controlElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      controlElement.focus();
    }
  }
  
  isValidEnicarEmail(email: string): boolean {
    return email?.endsWith('@enicar.ucar.tn') || false;
  }


 

 
  getSanitizedLogo(logo: string | undefined): SafeUrl | undefined {

      if (!logo) return undefined;
      
      // Check if it's already a data URL
      if (logo.startsWith('data:image')) {
        return this.sanitizer.bypassSecurityTrustUrl(logo);
      }
      
      // If it's a raw base64 string, construct the proper data URL
      const mimeType = this.detectMimeType(logo);
      const dataUrl = `data:${mimeType};base64,${logo}`;
      return this.sanitizer.bypassSecurityTrustUrl(dataUrl);

  }
  


  private detectMimeType(base64: string): string {
      // Simple detection - you might need to expand this based on your needs
      const signature = base64.substring(0, 30);
      if (signature.startsWith('/9j') || signature.includes('FFD8')) {
          return 'image/jpeg';
      } else if (signature.startsWith('iVBORw0KGgo')) {
          return 'image/png';
      }
      // Default to png if unknown
      return 'image/png';
  }
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR');
 
  }

}