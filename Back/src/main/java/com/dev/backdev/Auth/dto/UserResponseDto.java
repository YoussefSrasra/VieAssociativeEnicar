package com.dev.backdev.Auth.dto;

import java.util.Set;
import java.util.stream.Collectors;

import com.dev.backdev.Auth.model.User;
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
public class UserResponseDto {
    private Long id;
    private String nom;
    private String prenom;
    private String username;
    private String email;
    private String role;
    private Integer cin;
    private Filiere filiere;
    private Niveau niveau;
    private Sexe sexe;
    private Formation formation;
    private String photo;
    private boolean FirstLogin;
    private String managedClubName; 
    private Set<String> memberClubNames; 
    private boolean isManagerAccount; 

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.nom = user.getNom();
        this.prenom = user.getPrenom();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.cin = user.getCin();
        this.filiere = user.getFiliere();
        this.FirstLogin = user.getFirstLogin();
        this.niveau = user.getNiveau();
        this.sexe = user.getSexe();
        this.formation = user.getFormation();
        this.photo = user.getPhoto();
        
        
        this.isManagerAccount = user.getResponsibleClub() != null 
            && user.getUsername().equals(user.getResponsibleClub().getName());
        
        
        this.managedClubName = user.getResponsibleClub() != null 
            ? user.getResponsibleClub().getName() 
            : null;
            
        this.memberClubNames = user.getClubMemberships().stream()
            .map(membership -> membership.getClub().getName())
            .collect(Collectors.toSet());
    }
}