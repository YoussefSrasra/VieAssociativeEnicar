// Add these imports
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../../../profile/profile.service';
import { LoginService } from '../../../../../login.service';
import { UserProfile } from '../../../../../profile/models/profile.model';
import { IconService, IconDirective } from '@ant-design/icons-angular';
import { ClubMembershipService } from '../../../../../services/club-membership.service';

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
  constructor(private profileService: ProfileService, private loginService: LoginService, private clubMembershipService: ClubMembershipService,  private clubSelectionService: ClubSelectionService) {
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
    const clubRole = this.currentUser.role; // or however you store it
    const isInManagerSession = localStorage.getItem('managerSession') !== null;
  
    return clubRole && clubRole !== 'MEMBER' && !isInManagerSession;
  }
  
  isManagerSession(): boolean {
    return localStorage.getItem('managerSession') !== null;
  }
  
  switchToManager(): void {
    const personalSession = JSON.stringify(this.currentUser);
    localStorage.setItem('personalSession', personalSession);
  
    const clubId = localStorage.getItem('selectedClubId');
    const username = this.currentUser?.username;
  
    // Simulate backend login with elevated access
    /*this.authService.managerLogin(username, clubId).subscribe(managerUser => {
      localStorage.setItem('managerSession', JSON.stringify(managerUser));
      this.authService.setCurrentUser(managerUser); // however you update current user
      window.location.reload(); // or router navigation to refresh navbar
    });*/
  }
  
  switchBackToPersonal(): void {
    const personalUser = JSON.parse(localStorage.getItem('personalSession') || '{}');
    //this.authService.setCurrentUser(personalUser);
    localStorage.removeItem('managerSession');
    window.location.reload();
  }
  

  // ... rest of existing code
}
