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
public class UserUpdateDTO {
    private String username;
    private String nom;
    private String currentPassword;
    private String password; 
    private String prenom;
    private String email;
    private String role;
    private Integer cin;
    private Filiere filiere;
    private Niveau niveau ;
    private Sexe sexe;
    private Formation formation;
    private String photo;
    private String clubName; // Only club name (optional update)


    public UserUpdateDTO(User user) {
        this.username = user.getUsername();
        this.nom = user.getNom();
        this.prenom = user.getPrenom();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.cin = user.getCin();
        this.filiere = user.getFiliere();
        this.niveau = user.getNiveau();
        this.sexe = user.getSexe();
        this.formation = user.getFormation();
        this.photo = user.getPhoto();
        this.clubName = user.getClub().getName(); // Only club name (optional update)
        this.currentPassword = user.getPassword(); // Store the current password for verification
    }
    // Getters and setters
    public String getUsername() {
        return username;
    }
    public String getCurrentPassword() {
        return currentPassword;
    }
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
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
    public String getClubName() {
        return clubName;
    }
    public void setClubName(String clubName) {
        this.clubName = clubName;
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
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;}

        
}
