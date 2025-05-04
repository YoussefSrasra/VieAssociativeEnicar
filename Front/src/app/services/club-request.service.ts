import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders ,HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map ,tap } from 'rxjs/operators';
import { AuthServiceService } from './auth-service.service';

interface EventRequest {
  id?: number;

  eventName: string;
  type: string;
  description: string;
  location: string;
  startDate: string;  // ou Date si votre backend gère les objets Date
  endDate: string;    // ou Date
  financialRequest: boolean;
  requestedAmount?: number;
  estimatedAttendees?: number;
  needEquipment: boolean;
  equipmentDescription?: string;
  status?: string;

}

interface EventRequestDTO{
  id : number,
  nom: string;
  type: string;
  description: string;
  location: string;
  startDate: string; // ou Date si votre backend gère les objets Date
  endDate: string;
  clubName: string

}

@Injectable({
  providedIn: 'root'
})
export class ClubRequestService {
  private apiUrl = 'http://localhost:8081/api/event-requests';
  private clubsUrl = 'http://localhost:8081/api/clubs';

  constructor(private http: HttpClient ,    private authService: AuthServiceService // Injectez AuthService
  ) { }

private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  createEventRequest(eventRequest: EventRequest): Observable<EventRequest> {
    // Récupère l'ID du club de l'utilisateur connecté
    const clubId = this.authService.getCurrentUserClubId();

    return this.http.post<EventRequest>(
      this.apiUrl,
      {
        ...eventRequest,
        club: { id: clubId } // Ajoute l'ID du club automatiquement
      },
      { headers: this.getHeaders() }
    );
  }
  participateInEvent(eventId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/events/${eventId}/participate`, {});
  }

  getEventRequests(): Observable<EventRequest[]> {
    return this.http.get<EventRequest[]>(this.apiUrl);
  }
  getAllRequests(): Observable<any[]> {
    return forkJoin({
      requests: this.http.get<any[]>(this.apiUrl),
      clubs: this.http.get<any[]>(this.clubsUrl)
    }).pipe(
      map(({requests, clubs}) => {
        return requests.map(request => {
          const club = clubs.find(c => c.id === request.clubId);
          return {
            ...request,
            clubName: club?.name || 'Club inconnu'
          };
        });
      })
    );
  }

  getEventRequestsByClub(clubId: number): Observable<EventRequest[]> {
    return this.http.get<EventRequest[]>(`${this.apiUrl}/club/${clubId}`);
  }

  approveEventRequest(id: number): Observable<EventRequest> {
    return this.http.put<EventRequest>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectEventRequest(id: number): Observable<EventRequest> {
    return this.http.put<EventRequest>(`${this.apiUrl}/${id}/reject`, {});
  }

  deleteEventRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



  approveRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {});
  }


// Dans club-request.service.ts
getApprovedEventsByClub(clubId: number): Observable<EventRequest[]> {
  return this.http.get<EventRequest[]>(`${this.apiUrl}/club/${clubId}`).pipe(
    map(events => events.filter(event => event.status === 'APPROVED'))
  );
}

// Corrigez la méthode getEventsByClub
// Dans ClubRequestService
getEventsByClub(clubId: number): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/club/${clubId}/event-names`).pipe(
    tap(data => console.log(`API response for club/${clubId}/event-names:`, data))
  );
}
getAcceptedEventsByClub(clubId : number): Observable<EventRequestDTO[]>{
  return this.http.get<EventRequestDTO[]>(`${this.apiUrl}/approved/club/${clubId}`).pipe(
    tap(data => console.log(`API response for approved/club/${clubId}`, data)))
}

getEventsByIds(eventIds: number[]): Observable<EventRequestDTO[]> {
  let params = new HttpParams();

  params = params.append('ids', eventIds.join(',')); // Convertit [1, 2, 3] en "1,2,3"
  return this.http.get<EventRequestDTO[]>(`${this.apiUrl}/by-ids`, { params });
}


}
