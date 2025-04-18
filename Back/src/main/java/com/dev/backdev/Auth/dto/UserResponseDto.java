package com.dev.backdev.Auth.dto;

import java.util.Set;
import java.util.stream.Collectors;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Enums.Filiere;
import com.dev.backdev.Enums.Formation;
import com.dev.backdev.Enums.Niveau;
import com.dev.backdev.Enums.Sexe;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;



@AllArgsConstructor
@NoArgsConstructor
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
    private String managedClubName; // Name of club they manage (if any)
    private Set<String> memberClubNames; // Names of all clubs they're member of

    // Constructor from User entity
    public UserResponseDto(User user) {
        this.id = user.getId();
        this.nom = user.getNom();
        this.prenom = user.getPrenom();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.cin = user.getCin();
        this.filiere = user.getFiliere();
        this.niveau = user.getNiveau();
        this.sexe = user.getSexe();
        this.formation = user.getFormation();
        this.photo = user.getPhoto();
        
        // Find managed club
        this.managedClubName = user.getMemberClubs().stream()
            .filter(club -> user.equals(club.getResponsibleMember()))
            .findFirst()
            .map(Club::getName)
            .orElse(null);
            
        // Get all member club names
        this.memberClubNames = user.getMemberClubs().stream()
            .map(Club::getName)
            .collect(Collectors.toSet());
    }

    public UserResponseDto(Long id, String username, String email, String role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.memberClubNames = Set.of(); // Initialize empty set
    }

    // Getters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getManagedClubName() { return managedClubName; }
    public Set<String> getMemberClubNames() { return memberClubNames; }
    public Integer getCin() { return cin; }
    public Filiere getFiliere() { return filiere; }
    public Niveau getNiveau() { return niveau; }
    public Sexe getSexe() { return sexe; }
    public Formation getFormation() { return formation; }
    public String getPhoto() { return photo; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
}
