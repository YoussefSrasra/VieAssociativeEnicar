import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
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
  club: {
    id: number;
    name?: string;  // optionnel si seulement l'ID est requis pour la création
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClubRequestService {
  private apiUrl = 'http://localhost:8081/api/event-requests';
  private clubsUrl = 'http://localhost:8081/api/clubs';

  constructor(private http: HttpClient) { }

  createEventRequest(eventRequest: EventRequest): Observable<EventRequest> {
    return this.http.post<EventRequest>(this.apiUrl, eventRequest);
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


}
