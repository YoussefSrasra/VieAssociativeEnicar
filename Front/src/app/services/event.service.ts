import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventService {
  private _events = new BehaviorSubject<any[]>([]);
  public events$ = this._events.asObservable();

  addEvent(event: any) {
    const current = this._events.value;
    this._events.next([...current, {
      ...event,
      id: Date.now(),
      date: new Date()
    }]);
  }
}
