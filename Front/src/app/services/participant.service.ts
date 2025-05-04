import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Ajout de throwError
import { catchError, map } from 'rxjs/operators';

interface EventWithParticipants {
  id: number;
  eventName: string;
  registeredCount: number;
  waitingListCount?: number;
  participants: Participant[];
}

interface Participant {
  id: number;
  nom: string;
  prenom: string; // Maintenant présent
  email: string;
  createdAt: string;
  comite: string;
  participationType: string; // Mappé depuis participation_type
  niveauEtudes: string; // Mappé depuis niveau_studies
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private apiUrl = 'http://localhost:8081/api/participants';

  constructor(private http: HttpClient) { }

  // Ajout de la méthode getEventStats manquante
  getEventStats(): Observable<EventWithParticipants[]> {
    return this.http.get<EventWithParticipants[]>(`${this.apiUrl}/stats`).pipe(
      catchError(this.handleError)
    );
  }

  registerParticipant(participantData: any): Observable<any> {
    return this.http.post(this.apiUrl, participantData).pipe(
      catchError(this.handleError)
    );
  }

// participant.service.ts
getParticipantsByEvent(eventName: string): Observable<Participant[]> {
  const encodedName = encodeURIComponent(eventName);
  return this.http.get<any[]>(`${this.apiUrl}/by-event/${encodedName}`).pipe(
    map(response => response.map(item => ({
      id: item.id,
      nom: item.nom,        // Doit correspondre au champ Java
      prenom: item.prenom,  // Doit correspondre au champ Java
      email: item.email,
      createdAt: item.createdAt || item.created_at,
      comite: item.comite || item.committee,
      participationType: item.participationType || item.participation_type,
      niveauEtudes: item.niveauEtudes || item.niveau_etudes
    })))
  );
}
  sendReminder(eventId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/reminder/${eventId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error:', error);
    return throwError(() => new Error(
      error.error?.message || 'Server error occurred'
    ));
  }
  approveParticipant(id: number): Observable<any> {
    const url = `http://localhost:8081/api/participants/${id}/approve`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.patch(url, {}, { headers, withCredentials: true }).pipe(
      catchError(error => {
        console.error('Erreur complète:', error);
        if (error.status === 0) {
          throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré et accessible.');
        }
        throw error;
      })
    );
  }

  rejectParticipant(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}/reject`;
    return this.http.patch<void>(url, {}).pipe(
      catchError((error) => {
        console.error('Erreur lors du refus:', error);
        return throwError(() => new Error(error.error?.message || 'Erreur serveur'));
      })
    );
  }

  getDistinctEventNames(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/distinct-events`).pipe(
      catchError(this.handleError)
    );
  }

}
