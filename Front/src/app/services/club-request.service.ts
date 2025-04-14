import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface EventRequest {
  id?: number;
  club: { id: number };
  eventName: string;
  type: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  financialRequest?: boolean;
  requestedAmount?: number;
  estimatedAttendees?: number;
  needEquipment?: boolean;
  equipmentDescription?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClubRequestService {
  private apiUrl = 'http://localhost:8080/api/event-requests';

  constructor(private http: HttpClient) { }

  createEventRequest(eventRequest: EventRequest): Observable<EventRequest> {
    return this.http.post<EventRequest>(this.apiUrl, eventRequest);
  }

  getEventRequests(): Observable<EventRequest[]> {
    return this.http.get<EventRequest[]>(this.apiUrl);
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


  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  approveRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/reject`, {});
  }
}
