import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface Entretien {
  id: number;
  enrollment: { prenom: string; nom: string };
  dateEntretien: string;
  heureEntretien: string;
  statut: string;
  resultat: string;
  confirmation: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EntretienService {
  private apiUrl = 'http://localhost:8081/api/entretiens';

  constructor(private http: HttpClient) { }

  getEntretiens(): Observable<Entretien[]> {
    return this.http.get<Entretien[]>(this.apiUrl);
  }

  updateEntretien(id: number, entretien: Entretien): Observable<Entretien> {
    return this.http.put<Entretien>(`${this.apiUrl}/${id}`, entretien);
  }
  getEnrollmentDetails(enrollmentId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/enrollments/${enrollmentId}`);
  }
}
