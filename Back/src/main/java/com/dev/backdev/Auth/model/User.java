package com.dev.backdev.Auth.model;

import com.dev.backdev.Club.Model.Club;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private String role; // ROLE_MEMBER, ROLE_MANAGER, ROLE_ADMIN
    @OneToOne(mappedBy = "responsibleMember")
    private Club responsibleClub;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    
    // Constructors, Getters, and Setters
    public User() {}

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

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }
}   