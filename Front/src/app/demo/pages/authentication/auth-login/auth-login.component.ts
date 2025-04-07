import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-auth-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent {
  model = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  loginUser() {
    this.isLoading = true;
    this.errorMessage = '';

    this.loginService.login(this.model.username, this.model.password)
      .pipe(
        tap((response: { token: string }) => {
          // Stockage du token et redirection
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard/default']);
        }),
        catchError((error) => {
          this.errorMessage = error.error?.message || 'Échec de la connexion';
          return of(null);
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}