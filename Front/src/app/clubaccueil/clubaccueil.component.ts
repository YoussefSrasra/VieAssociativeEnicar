import { Component, OnInit } from '@angular/core';
import { ClubService } from './clubservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of, finalize } from 'rxjs';

@Component({
  selector: 'app-club',
  templateUrl: './clubaccueil.component.html',
  imports: [FormsModule, CommonModule],
  standalone: true,
  styleUrls: ['./clubaccueil.component.scss']
})
export class ClubComponent implements OnInit {
  clubs: any[] = [];
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
        this.clubs = data;
        console.log('Clubs reçus:', data); // Debug
      }
    });
  }
}
  

  