import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

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

interface UserDTO {
  id: number;
  nom: string;
  prenom: string;
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
      'http://localhost:8080/api/public/login',
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
      `http://localhost:8080/api/public/switch-to-manager/${clubId}/${username}`,
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
    // const token = localStorage.getItem('token');
    // if (!token) {
    //     return throwError(() => new Error('No token found'));
    // }

    return this.http.get<User>('http://localhost:8080/api/public/me', {
        // headers: new HttpHeaders({
        //     'Authorization': `Bearer ${token}`,
        //     'Content-Type': 'application/json'
        // })
    }).pipe(
        catchError(error => {
            console.error('Auth error:', error);
            // Optional: redirect to login
            // this.router.navigate(['/login']);
            return throwError(() => error);
        })
    );
}

  // Manually update the in-memory user state
  setCurrentUser(user: User): void {
    this.currentUser = user;
    // Optional: emit via a BehaviorSubject if multiple components depend on it
  }

  getAdminEmails() {
    return this.http.get<string[]>('http://localhost:8080/api/public/admin-emails');
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

  getAllUsersDTO(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>('http://localhost:8080/api/public/users/dto');
  }
}
