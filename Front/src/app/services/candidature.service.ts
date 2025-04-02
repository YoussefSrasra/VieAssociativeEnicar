import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

interface Candidature {
  nom: string;
  prenom: string;
  email: string;
  niveau: string;
  comite: string;
  participation: string;
  motivation: string;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private apiUrl = 'https://votre-api-url.com/api/candidatures';  // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}
  // Vous pouvez utiliser un BehaviorSubject pour stocker les événements en cours
  private eventsSubject = new BehaviorSubject<any[]>([]); // Changez 'any' par votre type d'événement
  events$ = this.eventsSubject.asObservable();


  // Méthode pour définir un événement (par exemple, cela pourrait être un événement sélectionné)
  setEvent(eventData: any): void {
    // Vous pouvez manipuler les données ici avant de les envoyer si nécessaire
    console.log('Événement reçu:', eventData);
    // Mettez à jour l'état avec l'événement (si nécessaire)
  }

  // Méthode pour ajouter un événement à la liste d'événements
  addEvent(eventData: any): Observable<any> {
    return this.http.post('URL_API_EVENT', eventData); // Assurez-vous que l'URL est correcte
  }
  // Ajouter une candidature
  addCandidature(candidature: Candidature): Observable<any> {
    return this.http.post(this.apiUrl, candidature);
  }
}
