import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // Add this import
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private router: Router // Inject Router

  ) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(
      'http://localhost:8080/api/public/login',
      { username, password }
    ).pipe(
      tap(response => {
        // Stocke le token dans le localStorage
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
