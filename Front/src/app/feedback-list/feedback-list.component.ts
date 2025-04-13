import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/components/card/card.component';
import { FeedbackService, Feedback } from '../services/feedback.service';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {
  feedbacks: Feedback[] = [];

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.getAllFeedbacks();
  }

  getAllFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => this.feedbacks = data,
      error: (err) => console.error('Erreur lors de la récupération des feedbacks :', err)
    });
  }
}
