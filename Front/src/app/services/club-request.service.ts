import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8081/api/club-requests';
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*' // Temporaire pour le test
});
@Injectable({
  providedIn: 'root'
})
export class ClubRequestService {
  constructor(private http: HttpClient) {}

  createRequest(request: any): Observable<any> {
    return this.http.post(API_URL, request);
  }

  getAllRequests(): Observable<any> {
    return this.http.get(API_URL);
  }

  getRequestById(id: number): Observable<any> {
    return this.http.get(`${API_URL}/${id}`);
  }

  approveRequest(id: number): Observable<any> {
    return this.http.put(`${API_URL}/${id}/approve`, {});
  }

  rejectRequest(id: number): Observable<any> {
    return this.http.put(`${API_URL}/${id}/reject`, {});
  }

  getRequestsByStatus(status: string): Observable<any> {
    return this.http.get(`${API_URL}/status/${status}`);
  }
}
