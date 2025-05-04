// Add these imports
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../../../profile/profile.service';
import { LoginService } from '../../../../../login.service';
import { UserProfile } from '../../../../../profile/models/profile.model';
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { ClubMembershipService } from '../../../../../services/club-membership.service';
import { Router } from '@angular/router'; // <-- at the top if not already imported

import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline
} from '@ant-design/icons-angular/icons';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';
import { Component, inject, input, output } from '@angular/core';
import { ClubSelectionService } from 'src/app/services/ClubSelectionService';

@Component({
  selector: 'app-nav-right',
  imports: [CommonModule, IconDirective, RouterModule, NgbNavModule, NgbDropdownModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})

export class NavRightComponent {
  private iconService = inject(IconService);
  
  styleSelectorToggle = input<boolean>();
  Customize = output();
  windowWidth: number;
  screenFull: boolean = true;
  currentUser: UserProfile;
  isLoading = true;

  // Modify constructor
  constructor(private profileService: ProfileService,  private router: Router ,    private loginService: LoginService, private clubMembershipService: ClubMembershipService,  private clubSelectionService: ClubSelectionService) {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline
      ]
    );
    this.clubSelectionService.selectedClubId$.subscribe(clubId => {
      if (localStorage.getItem('role') === 'MEMBER' && clubId) {
        this.loadClubRole(clubId);
      }
    });
    // Load current user
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.profileService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        const selectedClubId = localStorage.getItem('selectedClubId');

        if (user.role === 'MEMBER' && selectedClubId) {
          this.clubMembershipService.getUserRoleInClub(user.username, +selectedClubId).subscribe({
            next: (clubRole) => {
              this.currentUser.role = clubRole;  // override role
              console.log('User role in club:', clubRole);
              this.isLoading = false;
            },
            error: (err) => {
              console.warn('Failed to fetch club-specific role, defaulting to MEMBER:', err);
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load user', err);
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.loginService.logout()
  }

  formatImage(user: UserProfile | null): string {
    if (!user || !user.photo) {
      return 'assets/images/default-profile.png';
    }
  
    // Check if the photo already starts with "data:image/"
    if (user.photo.startsWith('data:image/')) {
      return user.photo; // Already has the header, return directly
    }
  
    // Otherwise, add the header manually
    return 'data:image/jpeg;base64,' + user.photo;
  }
  loadClubRole(clubId: number | null): void {
    if (!clubId || !this.currentUser) return;
  
    this.clubMembershipService.getUserRoleInClub(this.currentUser.username, clubId).subscribe({
      next: (clubRole) => this.currentUser.role = clubRole,
      error: (err) => console.warn('Could not update club role', err)
    });
  }
  
  canSwitchToManager(): boolean {
    const role = localStorage.getItem('role');
    if (role === 'ADMIN' || role === 'MANAGER') {
      return false; // Admins can't switch to manager
    }
    const clubRole = this.currentUser?.role;

    const isInManagerSession = localStorage.getItem('managerSession') !== null;
  
    return clubRole && clubRole !== 'MEMBER' && !isInManagerSession;
  }
  
  isManagerSession(): boolean {
    return localStorage.getItem('managerSession') !== null;
  }
  
  switchToManager(): void {
    const {id, username } = this.currentUser;
    const token = localStorage.getItem("token");
    // Only store essential info to avoid storage overflow
    const minimalUserSnapshot = JSON.stringify({ id, username, token });
    localStorage.setItem('personalSession', minimalUserSnapshot);
  
    const clubId = localStorage.getItem('selectedClubId');
    if (!clubId) {
      console.error("Club ID not found");
      return;
    }
  
    this.loginService.managerLogin(username, +clubId).subscribe(response => {
      const newToken = response.token;
    
      // Replace old token (personal) with manager token
      localStorage.setItem('token', newToken);
      localStorage.setItem('managerSession', 'true');
    
      // Fetch the manager identity using the new token
      this.loginService.getCurrentUser().subscribe(managerUser => {
        // Overwrite session values with manager identity
        localStorage.setItem('username', managerUser.username);
        localStorage.setItem('role', managerUser.role);
        this.loginService.setCurrentUser(managerUser);
    
        window.location.reload(); // Reload the UI with new session
      });
    });
    
  }
  
  
  
  switchBackToPersonal(): void {
    const personalSession = JSON.parse(localStorage.getItem('personalSession') || '{}');
  
    if (personalSession.token && personalSession.username) {
      localStorage.setItem('token', personalSession.token);
      localStorage.setItem('username', personalSession.username);
      localStorage.setItem('role', 'MEMBER'); // or whatever role you want to set
      this.loginService.setCurrentUser({
        id: personalSession.id,
        username: personalSession.username,
        role: "MEMBER", // or whatever role you want to set
      });
  
      // Optional: cleanup
      localStorage.removeItem('managerSession');
      localStorage.removeItem('personalSession');
      this.router.navigate(['/dashboard/default']).then(() => {
        window.location.reload();
      });
    } else {
      console.error('No personal session found to restore.');
    }
  }
  
  
  

  // ... rest of existing code
}
