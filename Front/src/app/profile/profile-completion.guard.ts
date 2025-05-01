import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProfileComponent } from './profile.component';

@Injectable({
  providedIn: 'root'
})
export class ProfileCompletionGuard implements CanDeactivate<ProfileComponent> {
  canDeactivate(
    component: ProfileComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Allow navigation if not first login or if profile is completed
    if (!component.isFirstLogin) {
      return true;
    }
    
    // Prevent navigation if first login is true
    const confirmation = confirm('Vous devez compléter votre profil avant de quitter cette page.');
    return confirmation;
  }
}