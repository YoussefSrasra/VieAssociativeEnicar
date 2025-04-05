package com.dev.backdev.Club.Model;

import java.util.ArrayList;
import java.util.List;

import com.dev.backdev.Auth.model.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialty;
    private String status; // e.g., "active", "inactive", "pending"
    private String logo;
    @OneToOne
    @JoinColumn(name = "responsible_member_id", referencedColumnName = "id")
    private User responsibleMember;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> members = new ArrayList<>();

    

    // Constructors, Getters, and Setters
    public Club() {}

    public Club(String name, String specialty, String status, User responsibleMember , String logo) {
        this.name = name;
        this.specialty = specialty;
        this.status = status;
        this.responsibleMember = responsibleMember;
        this.logo = logo;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public User getResponsibleMember() {
        return responsibleMember;
    }

    public void setResponsibleMember(User responsibleMember) {
        this.responsibleMember = responsibleMember;
    }

    public List<User> getMembers() {
        return members;
    }

    public void setMembers(List<User> members) {
        this.members = members;
    }

}