package com.dev.backdev.Auth.dto;

import com.dev.backdev.Enums.Filiere;
import com.dev.backdev.Enums.Formation;
import com.dev.backdev.Enums.Niveau;
import com.dev.backdev.Enums.Sexe;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserRegistrationDTO {
    private String username;
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String role;
    private Integer cin;
    private Filiere filiere;
    private Niveau niveau;
    private Sexe sexe;
    private Formation formation;
    private String photo;

    
}