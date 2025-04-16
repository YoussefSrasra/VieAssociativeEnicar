package com.dev.backdev.Club.Model;

import java.util.HashSet;
import java.util.Set;

import com.dev.backdev.Auth.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(length = 255) 
    private String specialty;
    private String status; // e.g., "active", "inactive", "pending"
   @Lob
@Column(columnDefinition = "LONGTEXT") // For MySQL
    private String logo;
    @OneToOne
    @JoinColumn(name = "responsible_member_id", referencedColumnName = "id")
    private User responsibleMember;

    @ManyToMany
    @JoinTable(
        name = "club_members",
        joinColumns = @JoinColumn(name = "club_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>(); // Regular members

    

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

    public void setResponsibleMember(User user) {
        this.responsibleMember = user;
        // Automatically add as member if not already
        if (!this.members.contains(user)) {
            this.members.add(user);
            user.getMemberClubs().add(this);
        }
    }

    // Helper method to add member
    public void addMember(User user) {
        if (!this.members.contains(user)) {
            this.members.add(user);
            user.getMemberClubs().add(this);
        }
    }

    // Helper method to remove member
    public void removeMember(User user) {
        // Can't remove if they're the manager
        if (this.responsibleMember != null && 
            this.responsibleMember.getId().equals(user.getId())) {
            throw new IllegalStateException("Cannot remove club manager. Change manager first.");
        }
        this.members.remove(user);
        user.getMemberClubs().remove(this);
    }
    public Set<User> getMembers() {
        return members;
    }
    

}