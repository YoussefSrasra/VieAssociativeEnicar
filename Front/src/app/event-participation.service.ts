import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventParticipationService {
  private baseUrl = `${environment.apiUrl}/api/participations`;

  constructor(private http: HttpClient) { }

  /**
   * Participer à un événement
   * @param memberId ID du membre
   * @param eventId ID de l'événement
   * @returns Observable<boolean> - true si succès, false si erreur
   */
  participate(memberId: number, eventId: number): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/${memberId}/events/${eventId}`, null).pipe(
      map(() => true),
      catchError(error => {
        console.error('Participation error:', error);
        return of(false);
      })
    );
  }

  /**
   * Annuler une participation
   * @param memberId ID du membre
   * @param eventId ID de l'événement
   * @returns Observable<boolean> - true si succès, false si erreur
   */
  cancelParticipation(memberId: number, eventId: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/${memberId}/events/${eventId}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Cancel participation error:', error);
        return of(false);
      })
    );
  }

  /**
   * Vérifier si un membre participe à un événement
   * @param memberId ID du membre
   * @param eventId ID de l'événement
   * @returns Observable<boolean> - état de participation
   */
  isParticipating(memberId: number, eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${memberId}/events/${eventId}/status`).pipe(
      catchError(error => {
        console.error('Participation status error:', error);
        return of(false);
      })
    );
  }

  /**
   * Obtenir tous les événements d'un membre
   * @param memberId ID du membre
   * @returns Observable<any[]> - liste des événements
   */
  getMemberEvents(memberId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${memberId}/events`).pipe(
      catchError(error => {
        console.error('Error fetching member events:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtenir tous les participants d'un événement
   * @param eventId ID de l'événement
   * @returns Observable<any[]> - liste des participants
   */
  getEventParticipants(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/events/${eventId}/members`).pipe(
      catchError(error => {
        console.error('Error fetching event participants:', error);
        return of([]);
      })
    );
  }
}
