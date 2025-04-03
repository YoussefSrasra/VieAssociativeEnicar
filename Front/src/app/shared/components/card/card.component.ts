import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule], // <-- Ajoutez ceci

  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() showHeader: boolean = true;
  @Input() headerTitle: string = '';
  @Input() blockClass: string = '';
}
