import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../services/event.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-event-list',
  template: `
    <div *ngFor="let event of events" class="event-card">
      <h3>{{ event.name }}</h3>
      <p>{{ event.description }}</p>
      <small>{{ event.date | date:'medium' }}</small>
    </div>

    <p *ngIf="events.length === 0">Aucun événement prévu</p>
  `,
  styles: [`
    .event-card {
      border: 1px solid #ddd;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
    }
  `]
})
export class EventListComponent implements OnInit {
  events: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.events$.subscribe(events => {
      this.events = events;
    });
  }
}
