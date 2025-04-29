package com.dev.backdev.Club.Model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.dev.backdev.Auth.model.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor 
@NoArgsConstructor
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(length = 255) 
    private String specialty;
    @Enumerated(EnumType.STRING)
    private ClubStatus status; 
    @Lob
    @Column(columnDefinition = "LONGTEXT") // For MySQL
    private String logo;
    @OneToOne
    @JoinColumn(name = "responsible_member_id", referencedColumnName = "id")
    private User responsibleMember;

    @OneToMany(mappedBy = "club", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private Set<ClubMembership> memberships = new HashSet<>();

    @Column(nullable = false)
    private boolean enrollmentOpen = true;
    private LocalDate mandatStartDate;
    private Integer mandatDurationMonths;


    
    public Club(String name, String specialty, ClubStatus status, User responsibleMember , String logo) {
        this.name = name;
        this.specialty = specialty;
        this.status = status;
        this.responsibleMember = responsibleMember;
        this.logo = logo;
    }

    public void setResponsibleMember(User manager) {
        if (this.responsibleMember == manager) {
            return; // Already linked, stop the loop
        }
    
        if (this.responsibleMember != null) {
            this.responsibleMember.setResponsibleClub(null);
        }
        this.responsibleMember = manager;
    
        if (manager != null && manager.getResponsibleClub() != this) {
            manager.setResponsibleClub(this);
        }
    }

    public List<User> getMembers() {
        List<User> members = new ArrayList<>();
        for (ClubMembership membership : memberships) {
            members.add(membership.getUser());
        }
        return members;
    }

    public List<ClubMembership> getMemberships() {
        return new ArrayList<>(memberships);
    }


    public enum ClubStatus {
        ACTIVE, INACTIVE, PENDING//, active, inactive , pending
    }
}

