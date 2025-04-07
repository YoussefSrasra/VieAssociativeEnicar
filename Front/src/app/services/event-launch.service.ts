import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}/api/even`;
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
});

@Injectable({
  providedIn: 'root'
})
export class EventLaunchService {
  constructor(private http: HttpClient) {}
  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${API_URL}/upcoming`).pipe(
      catchError(this.handleError)
    );
  }

  getLatestEvent(): Observable<Event[]> {
    return this.http.get<Event[]>(`${API_URL}/latest`).pipe(
      catchError(this.handleError)
    );
  }
  createEvent(eventData: any): Observable<any> {
    const formattedData = this.formatRequestData(eventData);
    return this.http.post(API_URL, formattedData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAllEvents(): Observable<any> {
    return this.http.get(API_URL, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getEventById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private formatRequestData(data: any): any {
    return {
      eventName: data.event_name,
      eventType: data.event_type,
      startDate: new Date(data.start_date).toISOString(),
      endDate: new Date(data.end_date).toISOString(),
      description: data.description,
      committees: this.formatCommittees(data.committees),
      maxParticipants: data.max_participants ? +data.max_participants : null,
      clubName: data.club_name
    };
  }

  private formatCommittees(committees: boolean[]): string[] {
    const committeeTypes = ['ORGANISATION', 'LOGISTIQUE', 'COMMUNICATION', 'SPONSORING'];
    return committees
      .map((checked, index) => checked ? committeeTypes[index] : null)
      .filter(committee => committee !== null) as string[];
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'Une erreur est survenue';

    if (error.status === 401) {
      errorMessage = 'Authentification requise';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
  getEventStats(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}}/stats`).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to load events'));
      })
    );
  }

}
