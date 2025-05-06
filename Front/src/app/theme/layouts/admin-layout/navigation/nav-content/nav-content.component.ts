import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule, Location, LocationStrategy } from '@angular/common';
import { RouterModule ,Router,NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filterNavigationByRole } from '../navigation-filter';
import { ClubBasicDTO } from 'src/app/demo/component/basic-component/color/models/ClubBasicDTO.model';
import { NavigationItem, NavigationItems } from '../navigation';
import { environment } from 'src/environments/environment';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { NavCollapseComponent } from './nav-collapse/nav-collapse.component';
import { ClubService } from 'src/app/services/Club.service';
import { IconService } from '@ant-design/icons-angular';
import { ChangeDetectorRef ,NgZone } from '@angular/core';
import { ClubRequestService } from 'src/app/services/club-request.service';
import { filter } from 'rxjs/operators'; // <-- Ajoutez ceci

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
  private ngZone = inject(NgZone); // Ajouter NgZone
  private router = inject(Router); // Ajouter Router
  private requestService = inject(ClubRequestService);

  NavCollapsedMob = output();
  navigations: NavigationItem[] = [];
  loadingClubs = false;

  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;
  windowWidth = window.innerWidth;

  private clubSubmenuItems: DynamicChild[] = [
    { title: 'Events', url: (id) => `/club/${id}/events` },
    { title: 'Events inscrit ', url: (id) => `/club/${id}/my-events` },
    { title: 'Feedback', url: (id) => `/club/${id}/feedback-evenement` }
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

  /*ngOnInit() {
    const userRole = this.getUserRoleFromStorage();
    this.navigations = filterNavigationByRole(NavigationItems, [userRole]);

    if (this.windowWidth < 1025) {
      (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
    }

    this.router.events.subscribe(() => {
      this.cdr.detectChanges();
    });
  }*/
    ngOnInit() {
      const userRole = this.getUserRoleFromStorage();
      this.navigations = filterNavigationByRole(NavigationItems, [userRole]);

      if (this.windowWidth < 1025) {
        (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
      }

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.handleRouteChange();
        this.forceMenuUpdate();
      });
    }

    private forceMenuUpdate(): void {
      const clubsItem = this.findMyClubsItem(this.navigations);
      if (clubsItem && clubsItem.children) {
        // Crée une nouvelle référence du tableau pour forcer la détection de changement
        clubsItem.children = [...clubsItem.children];
        this.cdr.detectChanges();

        // Double vérification après un léger délai
        setTimeout(() => {
          if (!document.querySelector('.coded-hasmenu.show')) {
            this.cdr.detectChanges();
          }
        }, 100);
      }
    }
    private handleRouteChange(): void {
      const currentUrl = this.router.url;
      const clubsItem = this.findMyClubsItem(this.navigations);
      const selectedClubId = localStorage.getItem('selectedClubId');

        // Force le rechargement des clubs quand on navigue vers une URL de club
        if (selectedClubId && clubsItem) {
          this.loadClubsForUser(); // true pour forcer le rechargement
        }
        
        this.cdr.detectChanges();
    }

    shouldForceUpdate(item: NavigationItem): boolean {
      return item.id === 'my-clubs' && this.router.url.includes('/club/');
    }

    public handleDynamicCollapseClick(itemId: string): void {
      if (itemId === 'my-clubs') {
        const clubsItem = this.findMyClubsItem(this.navigations);
        if (clubsItem) {
          // Réinitialise et recharge les clubs
          clubsItem.children = [];
          this.cdr.detectChanges();
          this.loadClubsForUser();
        }
      }
    }

  shouldForceReload(item: NavigationItem): boolean {
    return item.id === 'my-clubs' && this.router.url.includes('/club/');
  }
  loadClubsForUser(): void {
    const username = localStorage.getItem('username');
    if (!username) return;

    const clubsItem = this.findMyClubsItem(this.navigations);
    if (!clubsItem) return;

    this.clubService.getUserClubs(username).subscribe({
      next: (clubs) => {
        clubsItem.children = this.transformClubsToMenuItems(clubs);
        clubsItem.triggerExpansion = true;

        // Force la mise à jour du template
        this.ngZone.run(() => {
          this.cdr.detectChanges();
          setTimeout(() => {
            this.cdr.detectChanges();
            this.ensureMenuVisible();
          }, 150);
        });
      },
      error: (err) => {
        console.error('Failed to load clubs', err);
      }
    });
    this.fixMenuVisibility();

  }

  private fixMenuVisibility(): void {
    setTimeout(() => {
      const navContainer = document.querySelector('.coded-navbar');
      if (navContainer) {
        navContainer.classList.remove('coded-triggered');
        setTimeout(() => {
          navContainer.classList.add('coded-triggered');
        }, 50);
      }
    }, 200);
  }
  private ensureMenuVisible(): void {
    const myClubs = document.querySelector(`#collapse-my-clubs`);
    if (myClubs && !myClubs.classList.contains('coded-trigger')) {
      myClubs.classList.add('coded-trigger');
    }
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
      triggerExpansion: true, // Mark it for initial opening
      shouldExpand: true, // <-- New input to control expansion from parent
      children: this.clubSubmenuItems.map(child => ({
        id: `club-${club.id}-${child.title.toLowerCase()}`,
        title: child.title,
        type: 'item',
        url: child.url(club.id)
      }))
    }));
  }
}
