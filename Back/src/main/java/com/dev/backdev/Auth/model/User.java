package com.dev.backdev.Auth.model;

import java.util.HashSet;
import java.util.Set;

import com.dev.backdev.Club.Model.Club;
import com.dev.backdev.Club.Model.ClubMembership;
import com.dev.backdev.Enums.ClubRole;
import com.dev.backdev.Enums.Filiere;
import com.dev.backdev.Enums.Formation;
import com.dev.backdev.Enums.Niveau;
import com.dev.backdev.Enums.Sexe;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;




@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
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
    @OneToOne(mappedBy = "responsibleMember", cascade = CascadeType.ALL)
    private Club responsibleClub;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ClubMembership> clubMemberships = new HashSet<>();


    @Column(nullable = false)
    private boolean firstLogin = true; // Add this field
    
    // Constructors, Getters, and Setters

    public User(String username, String password, String email, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public void setResponsibleClub(Club responsibleClub) {
        if (this.responsibleClub == responsibleClub) {
            return; // Already linked, stop the loop
        }
    
        if (this.responsibleClub != null) {
            this.responsibleClub.setResponsibleMember(null);
        }
        this.responsibleClub = responsibleClub;
    
        if (responsibleClub != null && responsibleClub.getResponsibleMember() != this) {
            responsibleClub.setResponsibleMember(this);
        }
    }
    public Club getResponsibleClub() {
        return responsibleClub;
    } 
    public boolean isManagerAccount() {
        return this.responsibleClub != null && this.username.equals(this.responsibleClub.getName());
    }
    public boolean isFirstLogin() {
        return firstLogin;
    }
    public void setUsername(String username) {
        if (this.responsibleClub != null && !username.equals(this.responsibleClub.getName())) {
            throw new IllegalStateException("Le username d'un manager doit correspondre au nom de son club.");
        }
        this.username = username;
    }
    public void joinClub(Club club, ClubRole role) {
        ClubMembership membership = new ClubMembership(this, club,role);
        this.clubMemberships.add(membership);
        club.getMemberships().add(membership); // Assuming Club has a Set<ClubMembership> members
    }
    public boolean getFirstLogin() {
        return firstLogin;
    }
    
}   