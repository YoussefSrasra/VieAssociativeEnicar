import { Component, Input, Output, EventEmitter } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavigationItem } from '../../navigation';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { IconDirective } from '@ant-design/icons-angular';

@Component({
  selector: 'app-nav-collapse',
  standalone: true,
  imports: [CommonModule, IconDirective, RouterModule, NavItemComponent],
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', overflow: 'hidden' }),
        animate('250ms ease-in', style({ height: '*', overflow: 'hidden' }))
      ]),
      transition(':leave', [
        style({ height: '*', overflow: 'hidden' }),
        animate('250ms ease-out', style({ height: '0', overflow: 'hidden' }))
      ])
    ])
  ]
})
export class NavCollapseComponent {
  @Input() item!: NavigationItem;
  @Output() showCollapseItem: EventEmitter<void> = new EventEmitter();

  windowWidth: number;
  isOpen = false;

  constructor() {
    this.windowWidth = window.innerWidth;
  }

  navCollapse(event: MouseEvent): void {
    event.preventDefault();
    this.isOpen = !this.isOpen;

    const clickedElement = (event.target as HTMLElement);
    const parent = clickedElement.closest('.coded-hasmenu') as HTMLElement;

    // Fermer tous les autres menus ouverts
    const sections = document.querySelectorAll('.coded-hasmenu');
    sections.forEach(section => {
      if (section !== parent) {
        section.classList.remove('coded-trigger');
      }
    });

    // Ouvrir ou fermer le menu actuel
    if (parent) {
      parent.classList.toggle('coded-trigger', this.isOpen);
    }
  }

  subMenuCollapse(): void {
    this.showCollapseItem.emit();
  }
}
