import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = `${environment.apiUrl}/api/clubs`;

  constructor(private http: HttpClient) { }

  // Ajoutez cette méthode
  getAllClubs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Ajoutez aussi les autres méthodes nécessaires
  getClubByUsername(username: string): Observable<any> {
    console.log("usrrnameee "+username)
    return this.http.get<any>(`${this.apiUrl}/name/${username}`);
  }


  createClub(club: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, club);
  } 
  updateEnrollmentStatus(clubId: number, status: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${clubId}`, { 
      openEnrollment: status 
    });
  }
  toggleEnrollmentStatus(clubId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${clubId}/toggle-enrollment`, null,{ responseType: 'text' });
  }
  updateClub(clubId: number, club: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${clubId}`, club, {
      responseType: 'text' as 'json' // 👈 solution pour éviter l'erreur de parsing
    });
  }
  
}