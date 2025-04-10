import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { EntretienService } from './entretien.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-entretiens',
  imports: [CommonModule, FormsModule,NgbModule],
  templateUrl: './entretiens.component.html',
  styleUrl: './entretiens.component.scss'
})


export class EntretiensComponent implements OnInit {
  entretiens: any[] = [];
  selectedEnrollment: any = null;
  showModal = false;

  constructor(
    private entretienService: EntretienService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadEntretiens();
  }

  loadEntretiens(): void {
    this.entretienService.getEntretiens().subscribe({
      next: (data) => this.entretiens = data,
      error: (err) => console.error('Erreur:', err)
    });
  }

  showEnrollmentDetails(enrollmentId: number): void {
    this.entretienService.getEnrollmentDetails(enrollmentId).subscribe({
      next: (data) => {
        this.selectedEnrollment = data;
        this.showModal = true;
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  
  closeModal(): void {
    this.showModal = false;
    this.selectedEnrollment = null;
  }


  saveEntretien(entretien: any): void {
    this.entretienService.updateEntretien(entretien.id, entretien).subscribe({
      next: () => alert('Modifications sauvegardées!'),
      error: (err) => console.error('Erreur:', err)
    });
  }}