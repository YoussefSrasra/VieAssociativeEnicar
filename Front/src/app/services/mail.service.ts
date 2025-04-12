import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  // URL de votre API backend (remplacez par l'URL correcte de votre API)
  private mailApiUrl = 'https://your-api-endpoint/send-mail';

  constructor(private http: HttpClient) {}

  sendForm(formDetails: any): Observable<any> {
    // Envoie une requête HTTP POST vers votre serveur pour envoyer un e-mail
    return this.http.post(this.mailApiUrl, formDetails);
  }
}
