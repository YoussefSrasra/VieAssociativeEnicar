import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PartnerService } from '../../services/partner.service'; // Assure-toi du chemin correct vers ton service
import { CommonModule } from '@angular/common'; // Importation de CommonModule si nécessaire
@Component({
  selector: 'app-partnerships',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule,CommonModule],
  templateUrl: './partnerships.component.html',
  styleUrls: ['./partnerships.component.scss']
})
export class PartnershipsComponent implements OnInit {
  partnershipForm = this.fb.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    contact: ['', [Validators.required, Validators.email]],
    phone: [''],
    since: [''],
    details: ['']
  });

  partnershipTypes = [
    'Sponsor Principal',
    'Sponsor Officiel',
    'Partenaire Technologique',
    'Partenaire Média',
    'Partenaire Institutionnel',
    'Partenaire Académique'
  ];

  partners: any[] = [];  // Liste des partenaires
  editingPartner: any = null;

  constructor(private fb: FormBuilder, private partnerService: PartnerService) {}

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

  // Soumettre le formulaire
  onSubmit() {
    if (this.partnershipForm.valid) {
      const formData = this.partnershipForm.value;

      if (this.editingPartner) {
        // Mise à jour du partenaire existant
        this.partnerService.updatePartner(this.editingPartner.id, formData).subscribe(
          () => {
            this.loadPartners();  // Recharger les partenaires après mise à jour
            this.resetForm();
          },
          (error) => console.error('Erreur lors de la mise à jour du partenaire', error)
        );
      } else {
        // Ajouter un nouveau partenaire
        this.partnerService.createPartner(formData).subscribe(
          () => {
            this.loadPartners();  // Recharger les partenaires après ajout
            this.resetForm();
          },
          (error) => console.error('Erreur lors de l\'ajout du partenaire', error)
        );
      }
    }
  }

  // Modifier un partenaire
  editPartner(partner: any) {
    this.editingPartner = partner;
    this.partnershipForm.patchValue(partner);
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

  // Réinitialiser le formulaire
  resetForm() {
    this.partnershipForm.reset();
    this.editingPartner = null;
  }
}
