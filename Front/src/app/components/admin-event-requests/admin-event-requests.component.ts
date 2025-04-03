import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ClubRequestService } from '../../services/club-request.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-event-requests',
  standalone: true,
  imports: [CommonModule, CardComponent, DatePipe, FormsModule],
  templateUrl: './admin-event-requests.component.html',
  styleUrls: ['./admin-event-requests.component.scss']
})
export class AdminEventRequestsComponent implements OnInit {
  statusCards = [
    { title: 'En attente', value: '0', icon: 'hourglass', color: 'bg-warning' },
    { title: 'Approuvées', value: '0', icon: 'check-circle', color: 'bg-success' },
    { title: 'Rejetées', value: '0', icon: 'times-circle', color: 'bg-danger' },
    { title: 'Total', value: '0', icon: 'list-alt', color: 'bg-info' }
  ];

  eventRequests: any[] = [];
  filteredRequests: any[] = [];
  isLoading = false;
  searchTerm = '';
  selectedStatus = 'all';

  constructor(private requestService: ClubRequestService) {}

  ngOnInit(): void {
    this.loadEventRequests();
  }

  loadEventRequests(): void {
    this.isLoading = true;
    this.requestService.getAllRequests().subscribe({
      next: (requests) => {
        this.eventRequests = requests;
        this.filteredRequests = [...requests];
        this.updateStatusCards(requests);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  updateStatusCards(requests: any[]): void {
    const pending = requests.filter(r => r.status === 'Pending').length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;

    this.statusCards = [
      { ...this.statusCards[0], value: pending.toString() },
      { ...this.statusCards[1], value: approved.toString() },
      { ...this.statusCards[2], value: rejected.toString() },
      { ...this.statusCards[3], value: requests.length.toString() }
    ];
  }

  filterRequests(): void {
    this.filteredRequests = this.eventRequests.filter(request => {
      const matchesSearch = request.eventName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          request.club?.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || request.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'Pending': return 'En attente';
      case 'Approved': return 'Approuvé';
      case 'Rejected': return 'Rejeté';
      default: return status;
    }
  }

  viewAttachment(request: any): void {
    // Implémentez la logique pour voir le justificatif
    console.log('Voir justificatif pour:', request);
    // window.open(request.attachmentUrl, '_blank');
  }

  approveRequest(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir approuver cette demande ?')) {
      this.requestService.approveRequest(id).subscribe({
        next: () => this.loadEventRequests(),
        error: (err) => console.error(err)
      });
    }
  }

  rejectRequest(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir rejeter cette demande ?')) {
      this.requestService.rejectRequest(id).subscribe({
        next: () => this.loadEventRequests(),
        error: (err) => console.error(err)
      });
    }
  }
}
