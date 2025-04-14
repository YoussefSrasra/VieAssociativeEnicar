import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollformService {
  private apiUrl = 'http://localhost:8081/api/enrollments'; // Adaptez l'URL

  constructor(private http: HttpClient) {}

  createEnrollment(enrollmentData: any): Observable<any> {
    return this.http.post(this.apiUrl, enrollmentData);
  }
}
