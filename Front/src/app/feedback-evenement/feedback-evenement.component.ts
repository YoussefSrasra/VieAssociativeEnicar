import { Component, OnInit } from '@angular/core'; // Ajouter OnInit
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../shared/components/card/card.component';
import { ParticipantService } from '../services/participant.service'; // Importer le service de participants
import { FeedbackService, Feedback } from '../services/feedback.service';

@Component({
  selector: 'app-feedback-evenement',
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './feedback-evenement.component.html',
  styleUrls: ['./feedback-evenement.component.scss'] // Correction du styleUrl -> styleUrls
})
export class FeedbackEvenementComponent implements OnInit {
  feedbackForm: FormGroup;
  uploadedImages: string[] = [];
  eventList: string[] = [];  // Initialiser la liste des événements

  constructor(private fb: FormBuilder, private participantService: ParticipantService ,private feedbackService: FeedbackService) {
    this.feedbackForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      eventName: ['', Validators.required],
      comment: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      images: [null]
    });
  }

  ngOnInit(): void {
    this.getEventList();  // Appeler la méthode pour récupérer la liste des événements
  }

  // Méthode pour obtenir la liste des événements distincts
  getEventList(): void {
    this.participantService.getDistinctEventNames().subscribe(
      (events: string[]) => {
        this.eventList = events;  // Peupler la liste des événements
      },
      (error) => {
        console.error('Erreur lors de la récupération des événements:', error);
      }
    );
  }

  onImageUpload(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const feedback: Feedback = {
        ...this.feedbackForm.value,
        images: this.uploadedImages
      };

      this.feedbackService.submitFeedback(feedback).subscribe({
        next: () => {
          alert('Merci pour votre feedback !');
          this.feedbackForm.reset();
          this.uploadedImages = [];
        },
        error: (err) => {
          console.error('Erreur lors de l\'envoi du feedback :', err);
          alert('Erreur lors de l\'envoi du feedback.');
        }
      });
    }
  }

}
