import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ManagerWithClub {
  username: string;
  email: string;
  clubName: string;
  clubStatus: string;
}

@Injectable({ providedIn: 'root' })
export class EmergencyService {
  private apiUrl = 'http://localhost:8081/api/public/managers-with-clubs';

  constructor(private http: HttpClient) {}

  getEmergencyContacts(): Observable<ManagerWithClub[]> {
    return this.http.get<ManagerWithClub[]>(this.apiUrl);
  }
}
