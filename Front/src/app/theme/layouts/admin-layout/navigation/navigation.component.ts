// Angular import
import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import

import { NavContentComponent } from './nav-content/nav-content.component';

@Component({
  selector: 'app-navigation',
  imports: [NavContentComponent, CommonModule,RouterModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  // media 1025 After Use Menu Open
  NavCollapsedMob = output();

  navCollapsedMob;
  windowWidth: number;

  // Constructor
  constructor() {
    this.windowWidth = window.innerWidth;
    this.navCollapsedMob = false;
  }

  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }
}
