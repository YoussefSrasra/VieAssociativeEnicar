import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/components/card/card.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ à ajouter

@Component({
  selector: 'app-participant-certificat',
  templateUrl: './participant-certificat.component.html',
  styleUrls: ['./participant-certificat.component.scss'],
  imports: [CommonModule, CardComponent, FormsModule,ReactiveFormsModule]

})
export class ParticipantCertificatComponent {
  searchForm: FormGroup;
  participations: any[] = [];
  searched = false;
  loading = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.searchForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required]
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      const { nom, prenom } = this.searchForm.value;
      this.loading = true;
      this.http.get<any[]>(`http://localhost:8081/api/participants/search`, {
        params: { nom, prenom }
      }).subscribe({
        next: (data) => {
          this.participations = data;
          this.searched = true;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.participations = [];
          this.searched = true;
          this.loading = false;
        }
      });
    }
  }

  generatePDF(participation: any) {
    const { jsPDF } = window['jspdf'];  // Utilisation de `window['jspdf']` pour accéder à jsPDF

    const doc = new jsPDF();    doc.setFontSize(20);
    doc.text("Certificat de Participation", 20, 30);
    doc.setFontSize(14);
    doc.text(`Ce certificat est délivré à : ${participation.prenom} ${participation.nom}`, 20, 50);
    doc.text(`Pour sa participation à l'événement : ${participation.nomEvenement}`, 20, 60);
    doc.text(`Date : ${new Date(participation.dateCreation).toLocaleDateString()}`, 20, 70);
    doc.text("Félicitations et merci pour votre participation.", 20, 90);
    doc.save(`certificat-${participation.nom}.pdf`);
  }
}
