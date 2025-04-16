import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Feedback {
  firstName: string;
  lastName: string;
  email: string;
  eventName: string;
  comment: string;
  rating: number;
  images: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8080/api/feedbacks';

  constructor(private http: HttpClient) { }

  // Envoyer un feedback
  submitFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, feedback, {
      withCredentials: true // <- Ajoutez cette ligne
    }).pipe(
      catchError(this.handleError)
    );
  }
  // Récupérer tous les feedbacks (optionnel)
  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur côté serveur :', error);
    return throwError(() => new Error('Une erreur est survenue lors de la communication avec le serveur.'));
  }
}
