package com.dev.backdev.Auth.dto;

import com.dev.backdev.Enums.Filiere;
import com.dev.backdev.Enums.Formation;
import com.dev.backdev.Enums.Niveau;
import com.dev.backdev.Enums.Sexe;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProfileCompletionDTO {
    private String newPassword;
    
    private String nom;
    
    private String prenom;
    
    private Integer cin;
    
    private Filiere filiere;
    
    private Niveau niveau;
    
    private Sexe sexe;
    
    private Formation formation;
    
    private String photo; 
}