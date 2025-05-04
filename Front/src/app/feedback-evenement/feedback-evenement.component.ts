import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../shared/components/card/card.component';
import { FeedbackService, Feedback } from '../services/feedback.service';

@Component({
  selector: 'app-feedback-evenement',
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  templateUrl: './feedback-evenement.component.html',
  styleUrls: ['./feedback-evenement.component.scss']
})
export class FeedbackEvenementComponent {
  feedbackForm: FormGroup;

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) {
    this.feedbackForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      eventName: ['', Validators.required], // Champ texte libre pour l'événement
      comment: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  onImageUpload(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      const feedback: Feedback = {
        ...this.feedbackForm.value,
      };

      this.feedbackService.submitFeedback(feedback).subscribe({
        next: () => {
          alert('Merci pour votre feedback !');
          this.feedbackForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de l\'envoi du feedback :', err);
          alert('Erreur lors de l\'envoi du feedback.');
        }
      });
    }
  }
}
