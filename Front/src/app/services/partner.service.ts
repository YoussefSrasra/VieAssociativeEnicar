import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  private apiUrl = 'http://localhost:8080/api/partners';

  constructor(private http: HttpClient) {}

  getAllPartners(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPartnerById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createPartner(partner: any): Observable<any> {
    return this.http.post(this.apiUrl, partner);
  }

  updatePartner(id: number, partner: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, partner);
  }

  deletePartner(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
