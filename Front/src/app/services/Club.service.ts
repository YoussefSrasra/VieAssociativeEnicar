import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClubBasicDTO } from '../demo/component/basic-component/color/models/ClubBasicDTO.model';
import { catchError, tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class ClubService {
  private apiUrl = `${environment.apiUrl}/api/clubs`;

  constructor(private http: HttpClient) { }

  getUserClubs(username: string): Observable<ClubBasicDTO[]> {
    // const token = localStorage.getItem('token'); // or your token storage key
    
    // if (!token) {
    //   return throwError(() => new Error('No authentication token available'));
    // }
  
    return this.http.get<ClubBasicDTO[]>(
      `${this.apiUrl}/username/${encodeURIComponent(username)}`,
      {
        // headers: new HttpHeaders({
        //   'Authorization': `Bearer ${token}`,
        //   'Content-Type': 'application/json'
        // })
      }
    ).pipe(
      tap({
        next: (response) => console.log('Clubs response:', response),
        error: (err) => console.error('Error fetching clubs:', err)
      }),
      catchError(error => {
        // Handle specific error cases
        if (error.status === 401) {
          console.error('Unauthorized - possibly invalid token');
          // You might want to redirect to login here
        }
        return throwError(() => error);
      })
    );
  }

  getAllClubs(): Observable<ClubBasicDTO[]> {
    return this.http.get<ClubBasicDTO[]>(`${this.apiUrl}/basic`).pipe(
      tap({
        next: (response) => console.log('All clubs response:', response),
        error: (err) => console.error('Error fetching all clubs:', err)
      })
    );
  }
}