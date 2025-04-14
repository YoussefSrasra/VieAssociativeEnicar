import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmergencyService {
  private apiUrl = 'http://localhost:8081/api/public/managers'; // À adapter selon ton backend

  constructor(private http: HttpClient) {}

  getEmergencyContacts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
