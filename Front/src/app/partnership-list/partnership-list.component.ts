import { Component, OnInit } from '@angular/core';
import { PartnerService } from '../services/partner.service';
import { CardComponent } from '../shared/components/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
    imports: [ CardComponent ,CommonModule],

  selector: 'app-partnership-list',
  templateUrl: './partnership-list.component.html',
  styleUrls: ['./partnership-list.component.scss']
})
export class PartnershipListComponent implements OnInit {
  partners: any[] = [];  // Liste des partenaires

  constructor(private partnerService: PartnerService) {}

  ngOnInit() {
    this.loadPartners();  // Charger les partenaires au démarrage
  }

  // Charger la liste des partenaires
  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.partners = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des partenaires', error);
      }
    );
  }

  // Supprimer un partenaire
  deletePartner(id: number) {
    this.partnerService.deletePartner(id).subscribe(
      () => {
        this.loadPartners();  // Recharger les partenaires après suppression
      },
      (error) => console.error('Erreur lors de la suppression du partenaire', error)
    );
  }
}
