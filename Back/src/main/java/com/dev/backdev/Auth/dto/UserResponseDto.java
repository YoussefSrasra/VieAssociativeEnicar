package com.dev.backdev.Auth.dto;

import com.dev.backdev.Auth.model.User;
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
    private Niveau niveau ;
    private Sexe sexe;
    private Formation formation;
    private String photo;
    private String clubName; // Only club name, not full object

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
        this.clubName = (user.getClub() != null) ? user.getClub().getName() : null;
    }
    public UserResponseDto(Long id, String username, String email, String role, String clubName) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.clubName = clubName;
    }

    // Getters only (no setters)
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getClubName() { return clubName; }
    public Integer getCin() { return cin; }
    public Filiere getFiliere() { return filiere; }
    public Niveau getNiveau() { return niveau; }
    public Sexe getSexe() { return sexe; }
    public Formation getFormation() { return formation; }
    public String getPhoto() { return photo;}
    public String getNom() { return nom; }
    public String getPrenom() { return prenom;}
}
