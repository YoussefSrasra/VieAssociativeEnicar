import { Component, OnInit } from '@angular/core';
import { ClubRequestService } from '../services/club-request.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    clubs: 0
  };

  isLoading = true;

  constructor(private clubRequestService: ClubRequestService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.clubRequestService.getEventRequests().subscribe({
      next: (requests) => {
        this.stats.total = requests.length;
        this.stats.pending = requests.filter(r => r.status === 'PENDING').length;
        this.stats.approved = requests.filter(r => r.status === 'APPROVED').length;
        this.stats.rejected = requests.filter(r => r.status === 'REJECTED').length;
      // this.stats.clubs = new Set(requests.map(r => r.club.id)).size;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement statistiques', err);
        this.isLoading = false;
      }
    });
  }
}
