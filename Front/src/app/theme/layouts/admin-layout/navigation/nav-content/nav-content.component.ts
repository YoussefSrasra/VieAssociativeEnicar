import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filterNavigationByRole } from '../navigation-filter';
import { ClubBasicDTO } from 'src/app/demo/component/basic-component/color/models/ClubBasicDTO.model';
import { NavigationItem, NavigationItems } from '../navigation';
import { environment } from 'src/environments/environment';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { ClubService } from 'src/app/services/Club.service';
import { IconService } from '@ant-design/icons-angular';
import { ChangeDetectorRef } from '@angular/core';
import { ClubRequestService } from 'src/app/services/club-request.service';

import {
  DashboardOutline,
  CreditCardOutline,
  LoginOutline,
  QuestionOutline,
  ChromeOutline,
  FontSizeOutline,
  ProfileOutline,
  BgColorsOutline,
  AntDesignOutline
} from '@ant-design/icons-angular/icons';

interface DynamicChild {
  title: string;
  url: (id: number) => string;
}

@Component({
  selector: 'app-nav-content',
  imports: [CommonModule, RouterModule, NavGroupComponent, NavCollapseComponent],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  private iconService = inject(IconService);
  private clubService = inject(ClubService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // 👈 add this
  private requestService = inject(ClubRequestService);

  NavCollapsedMob = output();
  navigations: NavigationItem[] = [];
  loadingClubs = false;

  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;
  windowWidth = window.innerWidth;

  private clubSubmenuItems: DynamicChild[] = [
   // { title: 'Members', url: (id) => `/club/${id}/members` },
    { title: 'Events', url: (id) => `/club/${id}/events` },
   // { title: 'Documents', url: (id) => `/club/${id}/docs` }
  ];

  constructor() {
    this.iconService.addIcon(
      DashboardOutline,
      CreditCardOutline,
      FontSizeOutline,
      LoginOutline,
      ProfileOutline,
      BgColorsOutline,
      AntDesignOutline,
      ChromeOutline,
      QuestionOutline
    );
    this.navigations = [...NavigationItems]; // Copy initial nav
  }

  ngOnInit() {
    const userRole = this.getUserRoleFromStorage();
    this.navigations = filterNavigationByRole(NavigationItems, [userRole]);

    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }
  }




  public handleDynamicCollapseClick(itemId: string): void {
    console.log('handleDynamicCollapseClick fired for:', itemId);
    if (itemId === 'my-clubs') {
      this.loadClubsForUser();
    }
  }

  loadClubsForUser(event?: any) {
    console.log('loadClubsForUser() called!');

    const username = localStorage.getItem('username');
    if (!username) {
      console.error('No username found in localStorage');
      return;
    }

    const clubsItem = this.findMyClubsItem(this.navigations);
    if (!clubsItem) {
      console.error('My Clubs menu item not found');
      return;
    }
    this.clubService.getUserClubs(username).subscribe({
      next: (clubs) => {
        console.log('Clubs loaded:', clubs);
        clubsItem.children = this.transformClubsToMenuItems(clubs);
        clubsItem.triggerExpansion = true; // <-- tell the UI to auto-expand
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load clubs', err);
        clubsItem.children = [{
          id: 'error',
          title: 'Failed to load clubs',
          type: 'item',
          icon: 'warning'
        }];
      }
    });
  }

  private findMyClubsItem(items: NavigationItem[]): NavigationItem | undefined {
    for (const item of items) {
      if (item.id === 'my-clubs') return item;
      if (item.children) {
        const result = this.findMyClubsItem(item.children);
        if (result) return result;
      }
    }
    return undefined;
  }


  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    const ele = document.querySelector(`a.nav-link[href='${current_url}']`);
    const parent = ele?.parentElement;
    const up_parent = parent?.parentElement?.parentElement;
    const last_parent = up_parent?.parentElement;

    if (parent?.classList.contains('coded-hasmenu')) {
      parent.classList.add('coded-trigger', 'active');
    } else if (up_parent?.classList.contains('coded-hasmenu')) {
      up_parent.classList.add('coded-trigger', 'active');
    } else if (last_parent?.classList.contains('coded-hasmenu')) {
      last_parent.classList.add('coded-trigger', 'active');
    }
  }

  private getUserRoleFromStorage(): string {
    const role = localStorage.getItem('role');
    return role?.toUpperCase() || '';
  }

  navMob() {
    if (this.windowWidth < 1025 &&
        document.querySelector('app-navigation.coded-navbar')?.classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }


  private transformClubsToMenuItems(clubs: ClubBasicDTO[]): NavigationItem[] {
    return clubs.map(club => ({
      id: `club-${club.id}`,
      title: club.name,
      type: 'collapse',
      icon: 'icon-people',
      children: this.clubSubmenuItems.map(child => ({
        id: `club-${club.id}-${child.title.toLowerCase()}`,
        title: child.title,
        type: 'item',
        url: child.url(club.id)
      }))
    }));
  }
}
