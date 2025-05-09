import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { ClubRequestService } from '../../services/club-request.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-event-requests',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule],
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
        console.error('Erreur complète:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        console.error('URL:', err.url);
        console.error('Erreur complète:', JSON.stringify(err, null, 2));
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

  async generateReport(request: any): Promise<void> {
    // Créer une instance de jsPDF
    try {
      const { jsPDF } = window['jspdf'];  // Utilisation de `window['jspdf']` pour accéder à jsPDF

      const doc = new jsPDF();

      // Titre du document
      doc.setFontSize(18);
      doc.text('Rapport de Demande d\'Événement', 105, 15, { align: 'center' });
      doc.setFontSize(12);

      // Informations de la demande
      const yStart = 30;
      let y = yStart;

      const addLine = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}: `, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 20 + doc.getTextWidth(`${label}: `), y);
        y += 7;
      };

      addLine('ID de la demande', request.id.toString());
      addLine('Nom de l\'événement', request.eventName);
      addLine('Type', request.type);
      addLine('Club', request.clubId.toString() || 'Non spécifié');
      addLine('Date de début', new Date(request.startDate).toLocaleString());
      addLine('Date de fin', new Date(request.endDate).toLocaleString());
      addLine('Participants', request.estimatedAttendees?.toString() || 'Non spécifié');
      addLine('Montant demandé', request.financialRequest ? `${request.requestedAmount} €` : 'Non');
      addLine('Équipements', request.needEquipment ? request.equipmentDescription || 'Oui' : 'Non');
      addLine('Statut', this.getStatusText(request.status));

      // Ligne de séparation
      doc.line(20, y + 5, 190, y + 5);
      y += 10;

      // Date de génération du rapport
      doc.text(`Rapport généré le: ${new Date().toLocaleString()}`, 20, y);

      // Enregistrer le PDF
      doc.save(`rapport-evenement-${request.id}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Impossible de générer le PDF. Veuillez réessayer.');
    }
  }


  deleteEventRequest(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cette demande rejetée ?')) {
      this.requestService.deleteEventRequest(id).subscribe({
        next: () => {
          // Suppression locale pour éviter de recharger toute la liste
          this.eventRequests = this.eventRequests.filter(r => r.id !== id);
          this.filteredRequests = this.filteredRequests.filter(r => r.id !== id);
          this.updateStatusCards(this.eventRequests);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression de la demande');
        }
      });
    }
  }

}

