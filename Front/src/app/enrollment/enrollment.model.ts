import { N } from "@angular/core/navigation_types.d-Lh6SmhKv";

export interface Enrollment {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numeroTelephone: string;
  dateNaissance: string;
  departementEtude: string;
  niveauEtude: string;
  clubId: Number; 
  messageMotivation: string;
  etat: string; // 'EN_ATTENTE' | 'APPROUVEE' | 'REJETEE'
  club: {  // Structure correspondant à votre backend
    id: number;
    name: string;
    responsibleMemberUsername: string;

    openEnrollment?: boolean;
  };
}
  
  export enum EnrollmentStatus {
    EN_ATTENTE = 'EN_ATTENTE',
    ACCEPTE = 'ACCEPTE',
    REJETE = 'REJETE'
  }