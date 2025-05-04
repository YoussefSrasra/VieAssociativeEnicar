import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable
({
  providedIn: 'root'
})

export class DemandeClubService {
  private apiUrl = 'http://localhost:8080/api/demandes';

  constructor(private http: HttpClient) {}

  envoyerDemande(demande: any): Observable<any> {
    return this.http.post(this.apiUrl, demande);
  }

getDemandes(): Observable<DemandeClub[]> {
  return this.http.get<DemandeClub[]>(this.apiUrl);
}

approveDemande(id: number): Observable<DemandeClub> {
  return this.http.put<DemandeClub>(`${this.apiUrl}/${id}/approve`, {});
}

rejectDemande(id: number): Observable<DemandeClub> {
  return this.http.put<DemandeClub>(`${this.apiUrl}/${id}/reject`, {});
}

deleteDemande(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

creerClub(id: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/creer/${id}`, {});
}

}
export interface DemandeClub {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  nomClub: string;
  description: string;
  logoBase64: string;
  etat: 'ACCEPTE' | 'REJETE' | 'EN_ATTENTE';
}
