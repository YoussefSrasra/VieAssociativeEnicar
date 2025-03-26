package com.dev.backdev.enrollment.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus etat; // Changer le type de String à EnrollmentStatus

    // Getters and setters

    public EnrollmentStatus getEtat() {
        return etat;
    }

    public void setEtat(EnrollmentStatus etat) {
        this.etat = etat;
    }
}