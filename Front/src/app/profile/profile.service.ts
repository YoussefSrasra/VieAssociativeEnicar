import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from './models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8081/api/public';

  constructor(private http: HttpClient) { }

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  completeProfile(profileData: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/complete-profile`, profileData);
  }

  updateProfile(profileData: any): Observable<UserProfile> {
    const cleanedData = this.cleanProfileData(profileData);
    return this.http.put<UserProfile>(`${this.apiUrl}/users/${profileData.username}`, cleanedData);
  }
  private cleanProfileData(data: any): any {
    const cleanedData: any = {};
    
    // Only include fields that have values
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        cleanedData[key] = data[key];
      }
    });
  
    // Special handling for password fields
    if (!cleanedData.password) {
      delete cleanedData.currentPassword;
      delete cleanedData.password;
    }
  
    return cleanedData;
  }

  getUserByUsername(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/${username}`);
  }
}
