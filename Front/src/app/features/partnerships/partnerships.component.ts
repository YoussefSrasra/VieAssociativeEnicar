import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CardComponent } from '../../shared/components/card/card.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-partnerships',
  standalone: true,
  imports: [CardComponent,ReactiveFormsModule],
  templateUrl: './partnerships.component.html',
  styleUrls: ['./partnerships.component.scss']
})
export class PartnershipsComponent {
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

  partners = [
    { id: 1, name: 'Entreprise A', type: 'Financier', contact: 'contact@a.com', since: '2022' },
    { id: 2, name: 'Société B', type: 'Technologique', contact: 'contact@b.com', since: '2021' },
    { id: 3, name: 'Organisation C', type: 'Institutionnel', contact: 'contact@c.com', since: '2023' }
  ];

  editingPartner: any = null;

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.partnershipForm.valid) {
      const formData = this.partnershipForm.value;

      if (this.editingPartner) {
        // Mise à jour
        const index = this.partners.findIndex(p => p.id === this.editingPartner.id);
        this.partners[index] = { ...this.editingPartner, ...formData };
      }

      this.resetForm();
    }
  }

  editPartner(partner: any) {
    this.editingPartner = partner;
    this.partnershipForm.patchValue(partner);
  }

  deletePartner(id: number) {
    this.partners = this.partners.filter(p => p.id !== id);
  }

  resetForm() {
    this.partnershipForm.reset();
    this.editingPartner = null;
  }
}
