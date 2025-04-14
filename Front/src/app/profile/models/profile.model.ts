// src/app/profile/models/profile.model.ts
export interface UserProfile {
    id?: number;
    nom: string;
    prenom: string;
    username: string;
    //currentPassword: string;
    email: string;
    cin: number | null;
    filiere: Filiere | null;
    niveau: Niveau | null;
    sexe: Sexe | null;
    formation: Formation | null;
    photo: string | null;
    firstLogin: boolean;
    //password?: string;
    //confirmPassword?: string;
    role?: string;
  }
  
  export enum Filiere {
    GSIL = 'GSIL',
    Mecatronique = 'Mecatronique',
    Informatique = 'Informatique',
    Infotronique = 'Infotronique'
  }
  
  export enum Formation {
    INGENIERIE = 'INGENIERIE',
    MASTERE = 'MASTERE'
  }
  
  export enum Niveau {
    PREMIERE = 'PREMIERE',
    DEUXIEME = 'DEUXIEME',
    TROISIEME = 'TROISIEME'
  }
  
  export enum Sexe {
    HOMME = 'HOMME',
    FEMME = 'FEMME'
  }