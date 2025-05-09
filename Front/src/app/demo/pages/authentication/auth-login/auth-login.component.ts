import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserProfile } from 'src/app/profile/models/profile.model';
import { ProfileService } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-auth-login',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent {
  model = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';
  isFirstLogin = true;
  userProfile: UserProfile | null = null;
  adminEmails: string[] = [];
  loadingEmails = false;
  showForgotPasswordModal = false;

  constructor(
    private loginService: LoginService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  loginUser() {
    this.isLoading = true;
    this.errorMessage = '';
  
    this.loginService.login(this.model.username, this.model.password)
      .subscribe({
        next: (response: { token: string }) => {
          localStorage.setItem('token', response.token);
  
          this.profileService.getUserByUsername(this.model.username).subscribe({
            next: (userProfile: UserProfile) => {
              this.userProfile = userProfile;
  
              if (userProfile.firstLogin) {
                this.router.navigate(['/profile']);
              } else {
                this.router.navigate(['/dashboard/default']);
              }
            },
            error: (err) => {
              console.error('Failed to fetch user profile', err);
              this.router.navigate(['/dashboard/default']);
            }
          });
        },
        error: (err) => {
          this.errorMessage = 'Username or password are incorrect';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  openForgotPasswordModal() {
    this.loadingEmails = true;
    this.showForgotPasswordModal = true;
    
    this.loginService.getAdminEmails().subscribe({
      next: (emails) => {
        this.adminEmails = emails;
        this.loadingEmails = false;
      },
      error: (err) => {
        console.error('Failed to fetch admin emails', err);
        this.loadingEmails = false;
        this.errorMessage = 'Failed to load admin emails';
      }
    });
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
  }
}