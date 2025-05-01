// src/app/profile/models/profile.model.ts
export interface ClubMembershipDTO {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    photo: string | null;
    clubname: string;
    role: role;
  }
  
  export enum role {
    PRESIDENT = 'PRESIDENT',
    VICE_PRESIDENT = 'VICE_PRESIDENT',
    SECRETAIRE = 'SECRETAIRE',
    TREASORIER  = 'TREASORIER',
    MEMBRE  = 'MEMBRE',
  }
  
 