import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClubBasicDTO } from '../demo/component/basic-component/color/models/ClubBasicDTO.model';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class ClubService {
  private apiUrl = `${environment.apiUrl}/api/clubs`;

  constructor(private http: HttpClient) { }

  getUserClubs(username: string): Observable<ClubBasicDTO[]> {
    return this.http.get<ClubBasicDTO[]>(`${this.apiUrl}/username/${encodeURIComponent(username)}`).pipe(
      tap({
        next: (response) => console.log('Clubs response:', response),
        error: (err) => console.error('Error fetching members:', err)
      })
    );;
  }
}