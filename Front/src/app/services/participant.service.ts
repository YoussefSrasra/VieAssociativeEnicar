import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8080/api/participants';

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
  approveParticipant(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}/approve`;
    console.log("URL de la requête PATCH :", url);  // Affiche l'URL dans la console
    return this.http.patch<void>(url, {}).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'approbation:', error);
        return throwError(() => new Error(error.error?.message || 'Erreur serveur'));
      })
    );
  }

  rejectParticipant(id: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/${id}/reject`,
      {}
    );
  }

}
