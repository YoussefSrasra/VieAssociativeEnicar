package com.dev.backdev.Club.Model;

import com.dev.backdev.Auth.model.User;
import com.dev.backdev.Enums.ClubRole;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClubMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Club club;

    @Enumerated(EnumType.STRING)
    private ClubRole role;

    public ClubMembership(User user, Club club, ClubRole role) {
        this.user = user;
        this.club = club;
        this.role = role;
    }

    
}
