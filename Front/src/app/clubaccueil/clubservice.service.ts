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

  getAllClubs(): Observable<Club[]> {
    return this.http.get<Club[]>(this.apiUrl);
  }
}

interface Club {
  id: number;
  name: string;
  specialty: string;
  status: string;
  responsibleMember: {
    id: number;
  };
}