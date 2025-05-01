import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClubMembershipDTO } from '../demo/component/basic-component/color/models/ClubMembershipDTO.model';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ClubMembershipService {
  private apiUrl = `${environment.apiUrl}/api/memberships`;

  constructor(private http: HttpClient) { }

  getMembersByClub(username: string): Observable<ClubMembershipDTO[]> {
    return this.http.get<ClubMembershipDTO[]>(`${this.apiUrl}/getUsers/${encodeURIComponent(username)}`).pipe(
      tap({
        next: (response) => console.log('Members response:', response),
        error: (err) => console.error('Error fetching members:', err)
      })
    );;
  }

  /**
   * Modifie le rôle d'un membre dans un club
   * @param userId L'ID de l'utilisateur
   * @param clubId L'ID du club
   * @param newRole Le nouveau rôle à attribuer
   * @returns Observable de la réponse
   */
  updateMemberRole(membershipId: number, newRole: string): Observable<any> {
    const payload = {
      membershipId,
      newRole
    };
    return this.http.put(`${this.apiUrl}/update-role`, payload);
  }
  
  removeMemberFromClub(membershipId: number): Observable<any> {
    const params = new HttpParams()
      .set('membershipId', membershipId.toString());
  
    return this.http.delete(`${this.apiUrl}/remove`, { params });
  }
  

  /**
   * Ajoute un utilisateur à un club avec un rôle spécifique
   * @param userId L'ID de l'utilisateur
   * @param clubId L'ID du club
   * @param role Le rôle à attribuer
   * @returns Observable de la réponse
   */
  addUserToClub(userId: number, clubId: number, role: string): Observable<any> {
    const payload = {
      userId,
      clubId,
      role
    };
    return this.http.post(`${this.apiUrl}/add`, payload);
  }

    /**
   * Récupère le rôle de l'utilisateur dans un club spécifique
   * @param username Le nom d'utilisateur
   * @param clubId L'ID du club
   * @returns Observable contenant le rôle de l'utilisateur
   */
    getUserRoleInClub(username: string, clubId: number): Observable<string> {
      return this.http.get<string>(`${this.apiUrl}/getRole/${encodeURIComponent(username)}/${clubId}`).pipe(
        tap({
          next: (role) => console.log(`Fetched role for user ${username} in club ${clubId}:`, role),
          error: (err) => console.error('Error fetching user role in club:', err)
        })
      );
    }
}