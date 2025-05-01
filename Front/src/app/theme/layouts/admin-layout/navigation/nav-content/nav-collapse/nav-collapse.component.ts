// Angular import
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// project import
import { NavigationItem } from '../../navigation';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { IconDirective } from '@ant-design/icons-angular';
import { ClubSelectionService } from 'src/app/services/ClubSelectionService';
@Component({
  standalone: true, // <-- ADD THIS LINE
  selector: 'app-nav-collapse',
  imports: [CommonModule, IconDirective, RouterModule, NavItemComponent],
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', display: 'block' }),
        animate('250ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [animate('250ms ease-in', style({ transform: 'translateY(-100%)' }))])
    ])
  ]

})
export class NavCollapseComponent {
  // public props
  @Output() dynamicCollapseClick = new EventEmitter<string>();
  @Output() showCollapseItem = new EventEmitter<void>();
  @Output() loadClubs = new EventEmitter<void>();

  @Input() item!: NavigationItem;
  windowWidth: number;

  constructor(private clubSelectionService: ClubSelectionService) {
    this.windowWidth = window.innerWidth;
  }

  // Modify the navCollapse method
  navCollapse(event: MouseEvent) {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Stop event bubbling

    let parent = event.target as HTMLElement;

    if (parent?.tagName === 'SPAN') {
      parent = parent.parentElement!;
    }

    parent = (parent as HTMLElement).parentElement as HTMLElement;

    const sections = document.querySelectorAll('.coded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      if (sections[i] !== parent) {
        sections[i].classList.remove('coded-trigger');
      }
    }

    // Add this at the start of navCollapse method
    console.log('NavCollapse clicked for item:', this.item.id);
    const match = this.item.id.match(/^club-(\d+)$/);
      if (match) {
        this.clubSelectionService.setSelectedClubId(+match[1]);
      }


    if (this.item.id === 'my-clubs' && (!this.item.children || this.item.children.length === 0)) {
      console.log('Emitting loadClubs event from NavCollapse');
      this.loadClubs.emit();
      return; // Skip the rest if we're loading clubs
    }

    // Existing toggle logic
    let first_parent = parent.parentElement;
    let pre_parent = ((parent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
    if (first_parent?.classList.contains('coded-hasmenu')) {
      do {
        first_parent?.classList.add('coded-trigger');
        first_parent = ((first_parent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      } while (first_parent.classList.contains('coded-hasmenu'));
    } else if (pre_parent.classList.contains('coded-submenu')) {
      do {
        pre_parent?.parentElement?.classList.add('coded-trigger');
        pre_parent = (((pre_parent as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
      } while (pre_parent.classList.contains('coded-submenu'));
    }
    parent.classList.toggle('coded-trigger');
  }

  subMenuCollapse(item: void) {
    this.showCollapseItem.emit(item);
  }
  handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    console.log('Click handled for:', this.item.id);
  
    if (this.item.id === 'my-clubs') {
      console.log('Emitting dynamicCollapseClick event');
      this.dynamicCollapseClick.emit(this.item.id);
    } else {
      this.navCollapse(event);
    }
  }
  

  debugClick(event: MouseEvent) {
    console.log('CLICK EVENT REACHED LI:', this.item?.id);
  }
  
}