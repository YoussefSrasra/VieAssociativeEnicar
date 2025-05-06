import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { RiseOutline, FallOutline } from '@ant-design/icons-angular/icons';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { ParticipantService } from 'src/app/services/participant.service';
import { DemandeClubService } from 'src/app/accueil/demande-club.service';
import { ClubRequestService } from 'src/app/services/club-request.service';
import { ChartHelperService } from 'src/app/services/chart-helper-service.service';
import { PartnerService } from 'src/app/services/partner.service'; // Ajout du service
import {  OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClubService } from 'src/app/services/Club.service';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/login.service';




export interface ClubBasicDTO {
  id: number;
  name: string; // Assume API uses 'name'; adjust if it uses 'nomClub'
  /*description?: string;
  logo?: string; // Assume API uses 'logo'; adjust if it uses 'logoBase64'
  creator?: string; // Assume API uses 'creator'; adjust if it uses 'createur'
  status?: 'APPROVED' | 'PENDING' | 'REJECTED'; // Assume API uses 'status'; adjust if it uses 'etat'*/
}
@Component({
  selector: 'app-default',
  imports: [
    CommonModule,
    CardComponent,
    IconDirective,
    RouterModule // Ajoutez ceci

  ],
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements AfterViewInit {
  private iconService = inject(IconService);
  private loginService = inject(LoginService);
  private participantService = inject(ParticipantService);
  private demandeClubService = inject(DemandeClubService);
  private clubRequestService = inject(ClubRequestService);
  private chartHelper = inject(ChartHelperService);
  private clubService = inject(ClubService); // Inject ClubService
  private partnerService = inject(PartnerService); // Injection du PartnerService
  @ViewChild('eventChart') eventChartRef!: ElementRef;
  @ViewChild('eventTypeChart') eventTypeChartRef!: ElementRef;
  eventStats: any = {};
  clubStats: any = {};
  userStats: any = {};
  partners: any[] = []; // Liste des partenaires
  loading = true;
  approvedClubs: any[] = [];
  loadingClubs = true;
  userRole: string | null = null;
  isLoadingUser = true;
  loadingPartners = true;
  username:string = localStorage.getItem('username') || '';
  
  ngOnInit(): void {
     // Only load data needed for admin
    //  if (localStorage.getItem('role') === 'ADMIN') {
    //   this.loadApprovedClubs();
    //   this.loadBudgetData();
    //   this.loadTotalUsers();
    //   this.loadPartners();
    //   this.loadStats();
    //   this.loadEventRequestStats();
    //   this.loadClubStats();
    //   this.loadCharts();
    // }
    this.fetchUserData();

  }

  fetchUserData(): void {
    this.loginService.getCurrentUser().subscribe({
      next: (user) => {
        this.userRole = user.role; // Stockez le rôle
        this.username = user.username;
        localStorage.setItem('role', user.role);
        
        this.isLoadingUser = false;
        this.loadDataBasedOnRole(); // Chargez les données seulement après
      },
      error: (err) => {
        console.error('Error fetching user data', err);
        this.isLoadingUser = false;
      }
    });
  }
  loadDataBasedOnRole(): void {
    if (this.userRole === 'ADMIN') {
      this.loadApprovedClubs();
      this.loadBudgetData();
      this.loadTotalUsers();
      this.loadPartners();
      this.loadStats();
      this.loadEventRequestStats();
      this.loadClubStats();
      this.loadCharts();
    }
    // Pas de else nécessaire - les autres rôles n'ont pas besoin de données supplémentaires
  }
  
  loadBudgetData(): void {
    this.clubRequestService.getAllRequests().subscribe({
      next: (requests) => {
        // Calcul des stats globales
        const approvedRequests = requests.filter(r => r.status === 'APPROVED' && r.financialRequest);
        const pendingRequests = requests.filter(r => r.status === 'PENDING' && r.financialRequest);

        this.budgetStats.totalBudget = approvedRequests.reduce((sum, req) => sum + (req.requestedAmount || 0), 0);
        this.budgetStats.pendingRequests = pendingRequests.reduce((sum, req) => sum + (req.requestedAmount || 0), 0);
        this.budgetStats.percentageUsed = Math.min(
          Math.round((this.budgetStats.totalBudget / this.budgetStats.annualBudget) * 100),
          100
        );

        // Analyse par catégorie
        this.budgetStats.categories = [
          { name: 'Événements', amount: approvedRequests
              .filter(r => r.type === 'SOCIAL_EVENT' || r.type === 'CONFERENCE')
              .reduce((sum, req) => sum + (req.requestedAmount || 0), 0) },
          { name: 'Équipement', amount: approvedRequests
              .filter(r => r.needEquipment)
              .reduce((sum, req) => sum + (req.requestedAmount || 0), 0) },
          { name: 'Formation', amount: approvedRequests
              .filter(r => r.type === 'WORKSHOP' || r.type === 'SEMINAR')
              .reduce((sum, req) => sum + (req.requestedAmount || 0), 0) },
          { name: 'Autres', amount: approvedRequests
              .filter(r => !['SOCIAL_EVENT', 'CONFERENCE', 'WORKSHOP', 'SEMINAR'].includes(r.type) && !r.needEquipment)
              .reduce((sum, req) => sum + (req.requestedAmount || 0), 0) }
        ];

        // Dernières demandes
        this.recentBudgetRequests = requests
          .filter(r => r.financialRequest)
          .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
          .slice(0, 5)
          .map(r => ({
            ...r,
            amount: r.requestedAmount || 0,
            requestDate: r.startDate || new Date().toISOString()
          }));
      },
      error: (err) => console.error('Error loading budget data:', err)
    });
  }


  budgetStats = {
    annualBudget: 50000,
    totalBudget: 0,
    percentageUsed: 0,
    pendingRequests: 0,
    categories: [
      { name: 'Événements', amount: 0 },
      { name: 'Équipement', amount: 0 },
      { name: 'Formation', amount: 0 },
      { name: 'Autres', amount: 0 }
    ]
  };
  recentBudgetRequests: any[] = [];

  @ViewChild('budgetCategoryChart') budgetCategoryChartRef!: ElementRef;

 loadApprovedClubs(): void {
    this.loadingClubs = true;
    this.clubService.getAllClubs().subscribe({
      next: (clubs: ClubBasicDTO[]) => {
        console.log('Fetched clubs:', clubs);
        this.clubStats.totalClubs = clubs.length;
        console.log('Total clubs:', this.clubStats.totalClubs);
        const clubsActifsCard = this.AnalyticEcommerce.find(card => card.title === 'Clubs');
        if (clubsActifsCard) {
          clubsActifsCard.number = this.clubStats.totalClubs.toString();
        }
        
        this.loadingClubs = false;
      },
      error: (err) => {
        console.error('Erreur de chargement des clubs', err);
        this.loadingClubs = false;
      }
    });
  }


  loadTotalUsers(): void {
    this.loading = true;
    this.loginService.getAllUsersDTO().subscribe({
      next: (users) => {
        this.userStats.totalUsers = users.length;
        console.log('Fetched users:', users);
        const totalUsersCard = this.AnalyticEcommerce.find(card => card.title === 'Utilisateurs Totaux');
        console.log('Total users:', this.userStats.totalUsers);

        if (totalUsersCard) {
          totalUsersCard.number = this.userStats.totalUsers.toString();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement des utilisateurs', err);
        this.loading = false;
      }
    });
    }

  getRandomMembers(): number {
    // Fonction temporaire pour simuler le nombre de membres
    return Math.floor(Math.random() * 500) + 50;
  }

  openClubDetails(club: any): void {
    // Implémentez l'ouverture des détails du club
    console.log('Détails du club:', club);
  }
  constructor() {
    this.iconService.addIcon(...[RiseOutline, FallOutline]);
    this.loadStats();
    this.loadPartners(); // Charger les partenaires
    this.loadApprovedClubs();
  }
  loadPartners() {
    this.loadingPartners = true;
    this.partnerService.getAllPartners().subscribe({
      next: (data) => {
        this.partners = data;
        this.loadingPartners = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des partenaires', err);
        this.loadingPartners = false;
      }
    });
  }
  ngAfterViewInit() {
    this.loadCharts();
  }

  loadStats() {
    this.loading = true;

    this.participantService.getEventStats().subscribe({
      next: (events) => {
        this.eventStats = {
          totalEvents: events.length,
          totalParticipants: events.reduce((acc, event) => acc + event.registeredCount, 0),
          pendingApprovals: events.reduce((acc, event) => acc + (event.waitingListCount || 0), 0)
        };
        this.loadClubStats();
      },
      error: (err) => {
        console.error('Error loading event stats:', err);
        this.loadClubStats();
      }
    });
  }
  getPartnerIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'Entreprise': 'team',
      'Commerce': 'shop',
      'Banque': 'bank',
      'Transport': 'car',
      'Restauration': 'coffee',
      'International': 'global'
    };
    return iconMap[type] || 'team'; // Icône par défaut
  }

  getPartnerColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      'Entreprise': 'blue',
      'Commerce': 'green',
      'Banque': 'orange',
      'Transport': 'red',
      'Restauration': 'blue',
      'International': 'green'
    };
    return colorMap[type] || 'blue'; // Couleur par défaut
  }
  loadClubStats() {
    this.demandeClubService.getDemandes().subscribe({
      next: (demandes) => {
        this.clubStats = {
          pendingRequests: demandes.filter(d => d.etat === 'EN_ATTENTE').length,
          rejectedRequests: demandes.filter(d => d.etat === 'REJETE').length
        };
        this.loadEventRequestStats();
      },
      error: (err) => {
        console.error('Error loading club stats:', err);
        this.loadEventRequestStats();
      }
    });
  }

  loadEventRequestStats() {
    this.clubRequestService.getAllRequests().subscribe({
      next: (requests) => {
        this.eventStats.totalRequests = requests.length;
        this.eventStats.approvedRequests = requests.filter(r => r.status === 'APPROVED').length;
        this.eventStats.pendingRequests = requests.filter(r => r.status === 'PENDING').length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event request stats:', err);
        this.loading = false;
      }
    });
  }


loadCharts() {
  // Attendre un cycle de changement pour s'assurer que les vues sont prêtes
  setTimeout(() => {
    if (this.eventChartRef?.nativeElement) {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const eventData = [5, 8, 7, 10, 12, 15, 20, 18, 15, 12, 8, 6];
      const eventColors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'];

      this.chartHelper.createBarChart(
        this.eventChartRef.nativeElement,
        months,
        eventData,
        eventColors
      );
    }

    if (this.eventTypeChartRef?.nativeElement) {
      // Créer le deuxième graphique ici
      const types = ['Sport', 'Culture', 'Éducation', 'Social', 'Autre'];
      const typeData = [15, 20, 10, 8, 5];
      this.chartHelper.createPieChart(
        this.eventTypeChartRef.nativeElement,
        types,
        typeData
      );
    }
  });


}
isAdminView(): boolean {
  const role = localStorage.getItem('role'); // Or parse from 'currentUser'
  return role === 'ADMIN';
}

isManagerView(): boolean {
  const role = localStorage.getItem('role');
  return role === 'MANAGER';
}

isMemberView(): boolean {
  const role = localStorage.getItem('role');
  return role === 'MEMBER' || (!this.isAdminView() && !this.isManagerView());
}

  AnalyticEcommerce = [
    {
      title: 'Événements Actifs',
      amount: '0',
      background: 'bg-light-primary',
      border: 'border-primary',
      icon: 'rise',
      color: 'text-primary',
      number: '0'
    },
    {
      title: 'Utilisateurs Totaux',
      amount: '0',
      background: 'bg-light-primary',
      border: 'border-primary',
      icon: 'rise',
      color: 'text-primary',
      number: '0'
    },
    {
      title: 'Demandes en Attente',
      amount: '0',
      background: 'bg-light-warning',
      border: 'border-warning',
      icon: 'fall',
      color: 'text-warning',
      number: '0'
    },
    {
      title: 'Clubs',
      amount: '0',
      background: 'bg-light-success',
      border: 'border-success',
      icon: 'rise',
      color: 'text-success',
      number: '0'
    }
  ];


}
