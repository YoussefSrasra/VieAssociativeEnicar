import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClubSelectionService {
  private selectedClubIdSubject = new BehaviorSubject<number | null>(this.getInitialClubId());

  get selectedClubId$() {
    return this.selectedClubIdSubject.asObservable();
  }

  setSelectedClubId(id: number) {
    localStorage.setItem('selectedClubId', id.toString());
    this.selectedClubIdSubject.next(id);
  }

  private getInitialClubId(): number | null {
    const stored = localStorage.getItem('selectedClubId');
    return stored ? +stored : null;
  }
}
