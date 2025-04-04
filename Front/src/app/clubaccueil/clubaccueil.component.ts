import { Component, OnInit } from '@angular/core';
import { ClubService } from './clubservice.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of, finalize } from 'rxjs';

// Interface définie localement
interface Club {
  id: number;
  name: string;
  specialty: string;
  status?: string;
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

  constructor(private clubService: ClubService) {}

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
        this.clubs = data as Club[]; // Conversion explicite
      }
    });
  }
}