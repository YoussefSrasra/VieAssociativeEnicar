import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from './enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:8081/api/enrollments';

  constructor(private http: HttpClient) { }

  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.apiUrl);
  }

  approveEnrollment(id: number): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/approve/${id}`, {});
  }

  rejectEnrollment(id: number): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/reject/${id}`, {});
  }

  createEnrollment(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(this.apiUrl, enrollment);
  }
}
