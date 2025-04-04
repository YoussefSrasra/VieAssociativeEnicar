import { Component, OnInit } from '@angular/core';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.model';
import { CommonModule } from '@angular/common';

declare var bootstrap: any; // Déclaration pour TypeScript

@Component({
  selector: 'app-enrollment',
  imports: [CommonModule],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.scss'
})
export class EnrollmentComponent implements OnInit {
  enrollments: Enrollment[] = [];
  isLoading = true;
  errorMessage = '';
  selectedMotivation = '';

  constructor(private enrollmentService: EnrollmentService) { }

  ngOnInit(): void {
    this.loadEnrollments();
    // Initialiser les tooltips/popovers si nécessaire
    // [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(function (el) {
    //   new bootstrap.Tooltip(el);
    // });
  }

  loadEnrollments(): void {
    this.isLoading = true;
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des inscriptions';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  showMotivation(motivation: string): void {
    this.selectedMotivation = motivation;
    // Ouvre le modal Bootstrap
    const modalElement = document.getElementById('motivationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  approveEnrollment(id: number): void {
    this.enrollmentService.approveEnrollment(id).subscribe({
      next: () => {
        this.loadEnrollments();
      },
      error: (err) => console.error(err)
    });
  }

  rejectEnrollment(id: number): void {
    this.enrollmentService.rejectEnrollment(id).subscribe({
      next: () => {
        this.loadEnrollments();
      },
      error: (err) => console.error(err)
    });
  }
}