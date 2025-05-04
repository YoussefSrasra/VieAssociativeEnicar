import { Injectable } from '@angular/core';
export interface ClubDTO {
  id: number;
  name: string;
  specialty: string;
  status: string;
  logo: string;
  enrollmentOpen: boolean;
  responsibleMemberUsername: string | null;
  memberUsernames: string[];
  mandatStartDate: string;
  mandatDurationMonths: number;
}
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private tokenKey = 'token'; // Corrigé pour matcher votre localStorage

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Ajoutez d'autres méthodes d'authentification au besoin
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token; // Retourne true si le token existe
  }
// Before (problematic):
 // Ajoutez cette méthode pour stocker le token après connexion
 login(token: string): void {
  localStorage.setItem(this.tokenKey, token);
}

// After (fixed):
getCurrentUserClubId(): number {
  const userDataString = localStorage.getItem('myParticipations');
  if (!userDataString) {
    return 1; // Valeur par défaut (à adapter)
  }
  try {
    const userData = JSON.parse(userDataString);
    return userData.clubId || 1;
  } catch (e) {
    console.error('Erreur de parsing user_data', e);
    return 1;
  }
}
}


