import { Component,OnInit } from '@angular/core';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from './enrollment.model';
import { CommonModule } from '@angular/common';

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

  constructor(private enrollmentService: EnrollmentService) { }

  ngOnInit(): void {
    this.loadEnrollments();
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

  approveEnrollment(id: number): void {
    this.enrollmentService.approveEnrollment(id).subscribe({
      next: () => {
        this.loadEnrollments(); // Recharger la liste après approbation
      },
      error: (err) => console.error(err)
    });
  }

  rejectEnrollment(id: number): void {
    this.enrollmentService.rejectEnrollment(id).subscribe({
      next: () => {
        this.loadEnrollments(); // Recharger la liste après rejet
      },
      error: (err) => console.error(err)
    });
  }
}
