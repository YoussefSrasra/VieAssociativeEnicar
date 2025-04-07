export interface Enrollment {
    id?: number;
    nom: string;
    prenom: string;
    numeroTelephone: string;
    dateNaissance: string;
    departementEtude: string;
    niveauEtude: string;
    messageMotivation: string;
    email: string;
    etat: EnrollmentStatus;
  }
  
  export enum EnrollmentStatus {
    EN_ATTENTE = 'EN_ATTENTE',
    ACCEPTE = 'ACCEPTE',
    REJETE = 'REJETE'
  }