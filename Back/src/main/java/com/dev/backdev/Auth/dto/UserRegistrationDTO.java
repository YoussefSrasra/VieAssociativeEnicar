package com.dev.backdev.Auth.dto;

import com.dev.backdev.Enums.Filiere;
import com.dev.backdev.Enums.Formation;
import com.dev.backdev.Enums.Niveau;
import com.dev.backdev.Enums.Sexe;

public class UserRegistrationDTO {
    private String username;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private Integer cin;
    private Filiere filiere;
    private Niveau niveau ;
    private Sexe sexe;
    private Formation formation;
    private String photo;
    private ClubSimpleDto club; // Only needs club name


    // Getters and setters
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
   
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    } 
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public ClubSimpleDto getClub() {
        return club;
    }
    public void setClub(ClubSimpleDto club) {
        this.club = club;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getPrenom() {
        return prenom;
    }
    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }
    public void setCin(Integer cin) {
        this.cin = cin;
    }
    public Integer getCin() {
        return cin;
    }
    public void setFiliere(Filiere filiere) {
        this.filiere = filiere;
    }
    public Filiere getFiliere() {
        return filiere;
    }
    public void setNiveau(Niveau niveau) {
        this.niveau = niveau;
    }
    public Niveau getNiveau() {
        return niveau;
    }
    public void setSexe(Sexe sexe) {
        this.sexe = sexe;
    }
    public Sexe getSexe() {
        return sexe;
    }
    public void setFormation(Formation formation) {
        this.formation = formation;
    }
    public Formation getFormation() {
        return formation;
    }
    public void setPhoto(String photo) {
        this.photo = photo;
    }
    public String getPhoto() {
        return photo;
    }        
}