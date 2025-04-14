package com.dev.backdev.enrollment.model;


import com.dev.backdev.EvenementClub.model.EvenementClb;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Data
@Setter
@EqualsAndHashCode
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String numeroTelephone;
    private String dateNaissance;
    private String departementEtude;
    private String niveauEtude;
    private String messageMotivation;
    private String email;

    @ManyToOne
    @JoinColumn(name = "evenement_id")
    private EvenementClb evenement;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus etat;

    
    @Column(name = "club_id") // Juste la colonne ID
    private Long clubId; // Remplace Club club par Long clubId

    // Getters and setters

    public EnrollmentStatus getEtat() {
        return etat;
    }

    public void setEtat(EnrollmentStatus etat) {
        this.etat = etat;
    }
}