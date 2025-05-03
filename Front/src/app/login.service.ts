import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Define your backend's User interface (adjust fields if needed)
export interface User {
  id: number;
  username: string;
  email?: string;
  role: string;
}

interface LoginResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUser!: User; // currently logged-in user

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Standard login
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:8081/api/public/login',
      { username, password }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('username', username);
      })
    );
  }

  // Switch to manager account using username and clubId
  managerLogin(username: string, clubId: number): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `http://localhost:8081/api/public/switch-to-manager/${clubId}/${username}`,
      {}
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('managerSession', 'true');
        // Don't set username or role here since it's manager session now
      })
    );
  }

  // Fetch user profile for current JWT token
  getCurrentUser(): Observable<User> {
    return this.http.get<User>('http://localhost:8080/api/public/me');
  }

  // Manually update the in-memory user state
  setCurrentUser(user: User): void {
    this.currentUser = user;
    // Optional: emit via a BehaviorSubject if multiple components depend on it
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('selectedClubId');
    localStorage.removeItem('managerSession');
    localStorage.removeItem('personalSession');
    this.router.navigate(['/login']);
  }
}
