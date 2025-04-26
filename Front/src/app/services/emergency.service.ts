import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
interface ManagerWithClub {
  username: string;
  email: string;
  clubName: string;
  clubStatus: string;
  clubId?: number;
}

@Injectable({ providedIn: 'root' })
export class EmergencyService {
  private apiUrl = 'http://localhost:8081/api/public/managers-with-clubs';

  constructor(private http: HttpClient) {}

  getEmergencyContacts(): Observable<ManagerWithClub[]> {
    return this.http.get<ManagerWithClub[]>(this.apiUrl).pipe(
      tap(data => console.log('Données reçues:', data)),
      catchError(error => {
        console.error('Erreur API:', error);
        return throwError(error);
      })
    );
  }

  // Ajoutez d'autres méthodes si nécessaire
  deleteManagerContact(clubId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${clubId}`);
  }
}
