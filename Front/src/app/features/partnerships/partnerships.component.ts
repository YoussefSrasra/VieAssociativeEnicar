import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PartnerService } from '../../services/partner.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partnerships',
  standalone: true,
  imports: [CardComponent, ReactiveFormsModule, CommonModule],
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

  partners: any[] = [];
  editingPartner: any = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private partnerService: PartnerService) {}

  ngOnInit() {
    this.loadPartners();
  }

  loadPartners() {
    this.partnerService.getAllPartners().subscribe(
      (data) => {
        this.partners = data;
      },
      (error) => {
        this.showError('Erreur lors du chargement des partenaires');
        console.error(error);
      }
    );
  }

  onSubmit() {
    if (this.partnershipForm.valid) {
      const formData = this.partnershipForm.value;

      if (this.editingPartner) {
        this.partnerService.updatePartner(this.editingPartner.id, formData).subscribe(
          () => {
            this.loadPartners();
            this.showSuccess('Partenaire mis à jour avec succès !');
            this.resetForm();
          },
          (error) => {
            this.showError('Erreur lors de la mise à jour du partenaire');
            console.error(error);
          }
        );
      } else {
        this.partnerService.createPartner(formData).subscribe(
          () => {
            this.loadPartners();
            this.showSuccess('Partenaire ajouté avec succès !');
            this.resetForm();
          },
          (error) => {
            this.showError('Erreur lors de l\'ajout du partenaire');
            console.error(error);
          }
        );
      }
    }
  }

  editPartner(partner: any) {
    this.editingPartner = partner;
    this.partnershipForm.patchValue(partner);
  }

  deletePartner(id: number) {
    this.partnerService.deletePartner(id).subscribe(
      () => {
        this.loadPartners();
        this.showSuccess('Partenaire supprimé avec succès !');
      },
      (error) => {
        this.showError('Erreur lors de la suppression du partenaire');
        console.error(error);
      }
    );
  }

  resetForm() {
    this.partnershipForm.reset();
    this.editingPartner = null;
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => this.successMessage = null, 3000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => this.errorMessage = null, 5000);
  }
}
