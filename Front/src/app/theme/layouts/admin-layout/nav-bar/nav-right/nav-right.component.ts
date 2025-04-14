// Add these imports
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../../../profile/profile.service';
import { LoginService } from '../../../../../login.service';
import { UserProfile } from '../../../../../profile/models/profile.model';
import { IconService, IconDirective } from '@ant-design/icons-angular';
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

import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterModule } from '@angular/router';
import { Component, inject, input, output } from '@angular/core';


@Component({
  selector: 'app-nav-right',
  imports: [CommonModule, IconDirective, RouterModule, NgScrollbarModule, NgbNavModule, NgbDropdownModule],
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
  constructor(private profileService: ProfileService, private loginService: LoginService) {
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

    // Load current user
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.profileService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoading = false;
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

  
  // ... rest of existing code
}