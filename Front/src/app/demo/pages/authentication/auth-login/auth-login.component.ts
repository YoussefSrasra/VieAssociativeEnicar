import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserProfile } from 'src/app/profile/models/profile.model';
import { ProfileService } from 'src/app/profile/profile.service';


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
  isFirstLogin = true;
  userProfile: UserProfile | null = null;

  constructor(
    private loginService: LoginService,
    private profileService: ProfileService,
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
          this.profileService.getUserByUsername(this.model.username).subscribe({
            next: (userProfile: UserProfile) => {
              this.userProfile = userProfile;
              
              if (userProfile.firstLogin) {
                this.router.navigate(['/profile']); // Redirect to profile completion
              } else {
                this.router.navigate(['/dashboard/default']); // Normal dashboard
              }
            },
            error: (err) => {
              console.error('Failed to fetch user profile', err);
              this.router.navigate(['/dashboard/default']); // Fallback
            }
          });
        })
      )//ljjl
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}