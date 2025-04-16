package com.dev.backdev.Auth.model;

import java.util.HashSet;
import java.util.Set;

import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Enums.Filiere;
import com.dev.backdev.Enums.Formation;
import com.dev.backdev.Enums.Niveau;
import com.dev.backdev.Enums.Sexe;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;




@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private String username;
    private String password;
    private String email;
    private Integer cin;
    private Filiere filiere;
    private Niveau niveau ;
    private Sexe sexe;
    private Formation formation;
    @Column(name = "photo", columnDefinition = "LONGTEXT",nullable = true)
    private String photo;

    private String role; // ROLE_MEMBER, ROLE_MANAGER, ROLE_ADMIN
    @OneToOne(mappedBy = "responsibleMember")
    private Club responsibleClub;

    @ManyToMany(mappedBy = "members")  // Inverse side of the relationship
    private Set<Club> memberClubs = new HashSet<>();


    @Column(nullable = false)
    private boolean firstLogin = true; // Add this field
    
    // Constructors, Getters, and Setters

    public User(String username, String password, String email, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public String getPassword() {
        return password;
    }   
    public String getRole() {
        return role;
    }
    public String getUsername() {
        return username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Club getResponsibleClub() {
        return responsibleClub;
    }

    public void setResponsibleClub(Club responsibleClub) {
        this.responsibleClub = responsibleClub;
    }

    public void addMemberClub(Club club) {
        this.memberClubs.add(club);
        club.getMembers().add(this);
    }

    // Helper method to remove membership
    public void removeMemberClub(Club club) {
        this.memberClubs.remove(club);
        club.getMembers().remove(this);
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
    public String getEmail() {
        return email;
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