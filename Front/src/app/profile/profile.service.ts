import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from './models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8080/api/public';

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  completeProfile(profileData: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/complete-profile`, profileData);
  }

  updateProfile(profileData: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/users/${profileData.username}`, profileData);
  }
}