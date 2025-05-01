package com.dev.backdev.Club.dto;

import com.dev.backdev.Club.Model.ClubMembership;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClubMembershipDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String photo;
    private String clubName;
    private String role; 

    public ClubMembershipDTO(ClubMembership membership) {
        this.id = membership.getId();
        this.nom = membership.getUser().getNom();
        this.prenom = membership.getUser().getPrenom();
        this.email = membership.getUser().getEmail();
        this.photo = membership.getUser().getPhoto();
        this.clubName = membership.getClub().getName();
        this.role = membership.getRole().name(); // Convertit l'énum en chaîne de caractères
    }
}
