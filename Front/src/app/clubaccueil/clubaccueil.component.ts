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
  description?: string;
  status?: string;
  logo?: string;
  creationDate?: Date;
  membersCount?: number;
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
  imports: [CommonModule, FormsModule]
})
export class ClubAccueilComponent implements OnInit {
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
        // Option: Transformez les logos si nécessaire
        // this.clubs = this.clubs.map(club => ({
        //   ...club,
        //   logo: this.processLogo(club.logo)
        // }));
      }
    });
  }

  processLogo(logo: string | undefined): string | undefined {
    if (!logo) return undefined;
    
    // Si le logo ne commence pas par 'data:image', on ajoute le préfixe
    if (logo && !logo.startsWith('data:image')) {
      return `data:image/jpeg;base64,${logo}`;
    }
    return logo;
  }

  filterAndSortClubs(): void {
    // Filtrage
    this.filteredClubs = this.searchTerm 
      ? this.clubs.filter(club => 
          club.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          (club.specialty && club.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()))
        )
      : [...this.clubs];

    // Tri
    this.filteredClubs.sort((a, b) => {
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
    if (form.valid) {
      this.enrollService.createEnrollment(this.enrollmentData).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.showEnrollmentModal = false;
          form.resetForm();
          
          // Option: Afficher un message de succès
          // this.showSuccessMessage('Inscription réussie!');
        },
        error: (err) => {
          console.error('Erreur lors de l\'inscription:', err);
          this.formSubmissionError = err.error?.message || 'Erreur lors de la soumission du formulaire. Veuillez réessayer.';
        }
      });
    } else {
      this.formSubmissionError = 'Veuillez remplir tous les champs obligatoires correctement.';
      this.markFormAsTouched(form);
    }
  }

  private markFormAsTouched(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
  }

  getSanitizedLogo(logo: string | undefined): SafeUrl | undefined {
    if (!logo) return undefined;
    return this.sanitizer.bypassSecurityTrustUrl(logo);
  }

  // Méthode pour formater la date si nécessaire
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR');
  }
}