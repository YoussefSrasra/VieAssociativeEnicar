import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeClubService {
  private apiUrl = 'http://localhost:8081/api/demandes';

  constructor(private http: HttpClient) {}

  envoyerDemande(demande: any): Observable<any> {
    return this.http.post(this.apiUrl, demande); // Supprimé "/ajouter"
  }
}
